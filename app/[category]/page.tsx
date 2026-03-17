import { notFound } from 'next/navigation';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories, getCategoryBySlug } from '@/app/lib/categories';
import { getPostsByCategory } from '@/app/lib/posts';
import { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: categoryData.seoTitle || `${categoryData.name} - TuAsesorDeModa`,
    description: categoryData.seoDescription || categoryData.description,
    alternates: {
      canonical: `/${categoryData.slug}`,
    },
    openGraph: {
      url: `/${categoryData.slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    category: category.slug,
  }));
}

export const dynamicParams = false;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const posts = getPostsByCategory(category);
  const categories = getAllCategories().filter((item) =>
    ['mujer', 'hombre', 'belleza', 'recomendaciones', 'moda'].includes(item.slug)
  );
  const descriptions: Record<string, string> = {
    hombre:
      'Una portada editorial para explorar outfits, cortes, grooming y guías de estilo masculino con el mismo lenguaje visual limpio que usamos en toda la experiencia del blog.',
    mujer:
      'Tendencias, belleza, ideas de looks y guías de estilo femenino presentadas en un archivo consistente, amplio y más fácil de recorrer.',
    moda:
      'Diseñadores, pasarelas, colaboraciones y tendencias clave del universo fashion en un listado editorial unificado.',
    recomendaciones:
      'Selecciones curadas, guías de compra y productos destacados organizados con la misma lógica visual que la home y el archivo general.',
    belleza:
      'Rutinas, piel, maquillaje y cuidado personal reunidos en un listado claro, ordenado y coherente con el resto del sitio.',
  };

  return (
    <BlogShowcase
      eyebrow={categoryData.name}
      title={`Todo ${categoryData.name.toLowerCase()} en un mismo archivo visual`}
      description={descriptions[categoryData.slug] || categoryData.description || ''}
      posts={posts}
      categories={categories}
      activeCategorySlug={categoryData.slug}
    />
  );
}
