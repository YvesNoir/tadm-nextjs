import { Category } from '@/app/types';

export const CATEGORIES: Category[] = [
  {
    id: 'hombre',
    name: 'Hombre',
    slug: 'hombre',
    description: 'Moda masculina con outfits, estilo, cortes y consejos para vestir mejor',
    seoTitle: 'Moda hombre: outfits, tendencias y estilo masculino | TuAsesorDeModa',
    seoDescription: 'Explora artículos de moda hombre con outfits, smart casual, oficina, cortes de pelo y consejos de estilo masculino.'
  },
  {
    id: 'mujer',
    name: 'Mujer',
    slug: 'mujer',
    description: 'Moda femenina con tendencias, outfits, belleza y guías de estilo',
    seoTitle: 'Moda mujer: tendencias, outfits y estilo femenino | TuAsesorDeModa',
    seoDescription: 'Descubre artículos de moda mujer con tendencias, outfits, belleza, combinaciones de ropa y consejos de estilo.'
  },
  {
    id: 'moda',
    name: 'Moda',
    slug: 'moda',
    description: 'Inspiración, diseñadores y tendencias clave del mundo fashion',
    seoTitle: 'Moda - Diseñadores, Tendencias y Pasarelas | TuAsesorDeModa',
    seoDescription: 'Cobertura de diseñadores, semanas de la moda y tendencias globales para mantenerte al día.'
  },
  {
    id: 'belleza',
    name: 'Belleza',
    slug: 'belleza',
    description: 'Tips de belleza y cuidado personal',
    seoTitle: 'Belleza - Tips y Consejos de Cuidado Personal | TuAsesorDeModa',
    seoDescription: 'Consejos de belleza, cuidado de la piel, maquillaje y rutinas de cuidado personal.'
  },
  {
    id: 'salud',
    name: 'Salud',
    slug: 'salud',
    description: 'Bienestar y salud relacionado con la moda',
    seoTitle: 'Salud y Bienestar - Estilo de Vida Saludable | TuAsesorDeModa',
    seoDescription: 'Consejos de salud y bienestar relacionados con la moda y el estilo de vida.'
  },
  {
    id: 'zapatos',
    name: 'Zapatos y Calzado',
    slug: 'zapatos',
    description: 'Todo sobre calzado y zapatos',
    seoTitle: 'Zapatos y Calzado - Tendencias y Consejos | TuAsesorDeModa',
    seoDescription: 'Las mejores tendencias en zapatos y calzado, consejos para elegir el calzado perfecto.'
  },
  {
    id: 'perfumes',
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Fragancias y perfumes',
    seoTitle: 'Perfumes y Fragancias - Recomendaciones y Reseñas | TuAsesorDeModa',
    seoDescription: 'Descubre las mejores fragancias, perfumes y consejos para elegir tu fragancia ideal.'
  },
  {
    id: 'recomendaciones',
    name: 'Recomendaciones',
    slug: 'recomendaciones',
    description: 'Selección curada de productos, marcas y tips destacados',
    seoTitle: 'Recomendaciones de Moda y Estilo | TuAsesorDeModa',
    seoDescription: 'Descubre productos, marcas y consejos recomendados por nuestros editores para elevar tu estilo.'
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(category => category.slug === slug);
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}
