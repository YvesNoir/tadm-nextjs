import type { Metadata } from 'next';
import type { Category, Post } from '@/app/types';

export const SITE_NAME = 'TuAsesorDeModa';
export const SITE_URL = 'https://www.tuasesordemoda.com';
export const SITE_TWITTER = '@tuasesordemoda';

function trimText(value: string, max: number): string {
  const clean = String(value || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }

  return `${clean.slice(0, max - 1).trimEnd()}…`;
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
  const imageUrl = image || buildOgImageUrl({ title, description });

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'es_ES',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function createPostMetadata(post: Post): Metadata {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const path = `/${post.slug}`;
  const image = buildOgImageUrl({
    title: post.title,
    kicker: post.categories[0]?.name || 'Artículo',
    description: post.excerpt,
  });

  return {
    ...createBaseMetadata({
      title,
      description,
      path,
      image,
      type: 'article',
    }),
    authors: [{ name: post.author || SITE_NAME }],
    keywords: post.tags,
    openGraph: {
      ...createBaseMetadata({
        title,
        description,
        path,
        image,
        type: 'article',
      }).openGraph,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author || SITE_NAME],
      tags: post.tags,
      section: post.categories[0]?.name,
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
