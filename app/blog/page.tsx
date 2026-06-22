import type { Metadata } from 'next';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories } from '@/app/lib/categories';
import { getAllPosts } from '@/app/lib/posts';
import {
  buildCollectionPageSchema,
  buildListingItemListSchema,
  buildOgImageUrl,
  buildPageBreadcrumbSchema,
  createBaseMetadata,
} from '@/app/lib/seo';

export const metadata: Metadata = {
  ...createBaseMetadata({
    title: 'Blog de moda, estilo y belleza',
    description:
      'Descubre artículos de moda para mujer y hombre, belleza, tendencias, outfits y recomendaciones para vestir mejor cada día.',
    path: '/blog',
    image: buildOgImageUrl({
      title: 'Blog de moda, estilo y belleza',
      kicker: 'Blog',
      description:
        'Artículos de moda para mujer y hombre, belleza, tendencias, outfits y recomendaciones de estilo.',
    }),
  }),
};

export default function BlogPage() {
  const posts = getAllPosts().filter((post) => post.status === 'published');
  const categories = getAllCategories().filter((category) =>
    ['mujer', 'hombre', 'belleza', 'recomendaciones', 'moda'].includes(category.slug)
  );
  const title = 'Blog de moda, estilo y belleza para mujer y hombre';
  const description =
    'Explora artículos sobre outfits, tendencias, belleza, combinaciones de ropa y recomendaciones para encontrar ideas útiles según tu estilo y la ocasión.';
  const collectionSchema = buildCollectionPageSchema({
    name: title,
    description,
    path: '/blog',
  });
  const itemListSchema = buildListingItemListSchema(posts.slice(0, 24));
  const breadcrumbSchema = buildPageBreadcrumbSchema([
    { name: 'Inicio', path: '/' },
    { name: 'Blog', path: '/blog' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogShowcase
        eyebrow="Archivo"
        title={title}
        description={description}
        posts={posts}
        categories={categories}
      />
    </>
  );
}
