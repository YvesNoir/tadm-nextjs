import { Category } from '@/app/types';

export const CATEGORIES: Category[] = [
  {
    id: 'hombre',
    name: 'Hombre',
    slug: 'hombre',
    description: 'Moda y estilo masculino',
    seoTitle: 'Moda Hombre - Tendencias y Estilo Masculino | TuAsesorDeModa',
    seoDescription: 'Descubre las últimas tendencias en moda masculina, consejos de estilo y outfits para hombre.'
  },
  {
    id: 'mujer',
    name: 'Mujer',
    slug: 'mujer',
    description: 'Moda y estilo femenino',
    seoTitle: 'Moda Mujer - Tendencias y Estilo Femenino | TuAsesorDeModa',
    seoDescription: 'Explora las tendencias en moda femenina, consejos de estilo y outfits para mujer.'
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
