import type { Metadata } from 'next';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories } from '@/app/lib/categories';
import { getAllPosts } from '@/app/lib/posts';
import { createBaseMetadata, buildOgImageUrl } from '@/app/lib/seo';

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

  return (
    <BlogShowcase
      eyebrow="Archivo"
      title="Blog de moda, estilo y belleza para mujer y hombre"
      description="Explora artículos sobre outfits, tendencias, belleza, combinaciones de ropa y recomendaciones para encontrar ideas útiles según tu estilo y la ocasión."
      posts={posts}
      categories={categories}
    />
  );
}
