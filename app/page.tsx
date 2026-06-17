import type { Metadata } from 'next';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories } from './lib/categories';
import { getAllPosts } from './lib/posts';
import { createBaseMetadata, buildOgImageUrl } from './lib/seo';

export const metadata: Metadata = {
  ...createBaseMetadata({
    title: 'Moda, estilo y belleza para mujer y hombre',
    description:
      'Descubre artículos de moda para mujer y hombre, belleza, tendencias, outfits y recomendaciones para encontrar ideas útiles y vestir mejor cada día.',
    path: '/',
    image: buildOgImageUrl({
      title: 'Moda, estilo y belleza para mujer y hombre',
      kicker: 'Tu Asesor de Moda',
      description:
        'Artículos de moda, tendencias, outfits, belleza y recomendaciones para descubrir ideas útiles según tu estilo.',
    }),
  }),
};

export default function Home() {
  const posts = getAllPosts().filter(
    (post) =>
      post.status === 'published' &&
      !post.categories.some((category) => category.slug === 'recomendaciones')
  );
  const categories = getAllCategories().filter((category) =>
    ['mujer', 'hombre', 'belleza', 'recomendaciones'].includes(category.slug)
  );

  return (
    <BlogShowcase
      eyebrow="Tu asesor de moda"
      title="Moda, estilo y belleza para descubrir ideas que sí vas a usar"
      description="Explora artículos sobre tendencias, outfits, belleza y recomendaciones para mujer y hombre, con ideas útiles para vestir mejor según tu estilo y la ocasión."
      posts={posts}
      categories={categories}
    />
  );
}
