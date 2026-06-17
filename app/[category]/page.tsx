import { notFound } from 'next/navigation';
import BlogShowcase from '@/app/components/blog/BlogShowcase';
import { getAllCategories, getCategoryBySlug } from '@/app/lib/categories';
import { getPostsByCategory } from '@/app/lib/posts';
import { Metadata } from 'next';
import { createCategoryMetadata } from '@/app/lib/seo';

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

  return createCategoryMetadata(categoryData);
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
      'Explora artículos de moda masculina con ideas de outfits, smart casual, oficina, cortes de pelo y consejos para vestir mejor según tu estilo y la ocasión.',
    mujer:
      'Descubre artículos de moda femenina con tendencias, outfits, belleza, combinaciones de ropa y guías para encontrar prendas y estilos que realmente te favorezcan.',
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
      title={
        categoryData.slug === 'hombre'
          ? 'Moda hombre: outfits, estilo y consejos para vestir mejor'
          : categoryData.slug === 'mujer'
            ? 'Moda mujer: tendencias, outfits y consejos de estilo'
            : `Todo ${categoryData.name.toLowerCase()} en un mismo lugar`
      }
      description={descriptions[categoryData.slug] || categoryData.description || ''}
      posts={posts}
      categories={categories}
      activeCategorySlug={categoryData.slug}
    />
  );
}
