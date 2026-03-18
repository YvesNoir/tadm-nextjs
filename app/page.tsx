import type { Metadata } from 'next';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories } from './lib/categories';
import { getAllPosts } from './lib/posts';
import { createBaseMetadata, buildOgImageUrl } from './lib/seo';

export const metadata: Metadata = {
  ...createBaseMetadata({
    title: 'Moda, Estilo y Belleza',
    description:
      'Descubre artículos sobre moda femenina, masculina, belleza y recomendaciones en una portada editorial clara y pensada para explorar el blog completo.',
    path: '/',
    image: buildOgImageUrl({
      title: 'Las historias más nuevas sobre moda, belleza y estilo',
      kicker: 'Tu Asesor de Moda',
      description:
        'Una portada editorial para descubrir tendencias, ideas de outfits y recomendaciones con una experiencia visual cuidada.',
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
      title="Las historias más nuevas sobre moda, belleza y estilo"
      description="Una portada editorial limpia para descubrir tendencias, ideas de outfits y recomendaciones con una misma experiencia visual desde la home hasta el listado completo."
      posts={posts}
      categories={categories}
    />
  );
}
