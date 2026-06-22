import type { Metadata } from 'next';
import type { Category, Post } from '@/app/types';

export const SITE_NAME = 'TuAsesorDeModa';
export const SITE_URL = 'https://www.tuasesordemoda.com';
export const SITE_TWITTER = '@tuasesordemoda';
export const SITE_DESCRIPTION =
  'Descubre artículos de moda para mujer y hombre, belleza, tendencias, outfits y recomendaciones para encontrar ideas útiles y vestir mejor cada día.';

function trimText(value: string, max: number): string {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }

  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function normalizeMetadataTitle(value: string): string {
  return String(value || '')
    .replace(new RegExp(`\\s*[|\\-]\\s*${SITE_NAME}$`, 'i'), '')
    .trim();
}

export function buildAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString();
}

export function buildOgImageUrl({
  title,
  kicker,
  description,
}: {
  title: string;
  kicker?: string;
  description?: string;
}): string {
  const params = new URLSearchParams({
    title: trimText(title, 110),
  });

  if (kicker) {
    params.set('kicker', trimText(kicker, 40));
  }

  if (description) {
    params.set('description', trimText(description, 180));
  }

  return buildAbsoluteUrl(`/api/og?${params.toString()}`);
}

export function createBaseMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const normalizedTitle = normalizeMetadataTitle(title);
  const imageUrl = image || buildOgImageUrl({ title: normalizedTitle, description });

  return {
    title: normalizedTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url: path,
      title: normalizedTitle,
      description,
      siteName: SITE_NAME,
      locale: 'es_ES',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: normalizedTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      title: normalizedTitle,
      description,
      images: [imageUrl],
    },
  };
}

export function createPostMetadata(post: Post): Metadata {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const path = `/${post.slug}`;
  const section = post.categories[0]?.name;
  const image = post.coverImage
    ? buildAbsoluteUrl(post.coverImage)
    : buildOgImageUrl({
        title: post.title,
        kicker: section || 'Artículo',
        description: post.excerpt,
      });
  const baseMetadata = createBaseMetadata({
    title,
    description,
    path,
    image,
    type: 'article',
  });

  return {
    ...baseMetadata,
    authors: [{ name: post.author || SITE_NAME }],
    keywords: post.tags,
    openGraph: {
      type: 'article',
      url: path,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'es_ES',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author || SITE_NAME],
      tags: post.tags,
      section,
    },
  };
}

export function createCategoryMetadata(category: Category): Metadata {
  const title = category.seoTitle || `${category.name} | ${SITE_NAME}`;
  const description = category.seoDescription || category.description || '';

  return createBaseMetadata({
    title,
    description,
    path: `/${category.slug}`,
    image: buildOgImageUrl({
      title: category.name,
      kicker: 'Categoría',
      description,
    }),
  });
}

function buildAuthorSchema(authorName: string) {
  if (!authorName || authorName === SITE_NAME || authorName === 'TuAsesorDeModa') {
    return {
      '@id': `${SITE_URL}/#organization`,
    };
  }

  return {
    '@type': 'Person',
    name: authorName,
  };
}

export function buildPostSchema(post: Post) {
  const canonicalUrl = buildAbsoluteUrl(`/${post.slug}`);
  const category = post.categories[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
    mainEntityOfPage: canonicalUrl,
    headline: post.seoTitle || post.title,
    alternativeHeadline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage ? [buildAbsoluteUrl(post.coverImage)] : undefined,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: buildAuthorSchema(post.author),
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    articleSection: category?.name,
    keywords: post.tags.length > 0 ? post.tags.join(', ') : undefined,
    inLanguage: 'es-ES',
    url: canonicalUrl,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  };
}

export function buildPostBreadcrumbSchema(post: Post) {
  const category = post.categories[0];
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: SITE_URL,
    },
  ];

  if (category) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: category.name,
      item: buildAbsoluteUrl(`/${category.slug}`),
    });
  }

  items.push({
    '@type': 'ListItem',
    position: category ? 3 : 2,
    name: post.title,
    item: buildAbsoluteUrl(`/${post.slug}`),
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: buildAbsoluteUrl('/images/tuasesordemoda-logo.png'),
    },
    sameAs: [
      `https://x.com/${SITE_TWITTER.replace(/^@/, '')}`,
    ],
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildListingItemListSchema(posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: buildAbsoluteUrl(`/${post.slug}`),
      name: post.title,
    })),
  };
}

export function buildCollectionPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${buildAbsoluteUrl(path)}#collection`,
    url: buildAbsoluteUrl(path),
    name,
    description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    inLanguage: 'es-ES',
  };
}

export function buildPageBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path),
    })),
  };
}
