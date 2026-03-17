import type { Metadata } from 'next';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories } from '@/app/lib/categories';
import { getAllPosts } from '@/app/lib/posts';

export const metadata: Metadata = {
  title: 'Blog de Moda',
  description: 'Explora todos los artículos de Tu Asesor de Moda sobre tendencias, estilo, belleza y recomendaciones.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    url: '/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts().filter((post) => post.status === 'published');
  const categories = getAllCategories().filter((category) =>
    ['mujer', 'hombre', 'belleza', 'recomendaciones', 'moda'].includes(category.slug)
  );

  return (
    <BlogShowcase
      eyebrow="Archivo"
      title="Un listado editorial unificado para todo el blog"
      description="La misma lógica visual de la home aplicada al archivo completo: filtros claros, tarjetas amplias y una lectura más limpia para seguir refinando el diseño desde una base consistente."
      posts={posts}
      categories={categories}
    />
  );
}
