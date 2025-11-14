import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug } from '@/app/lib/categories';
import { getPostsByCategory } from '@/app/lib/posts';
import { Metadata } from 'next';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4"
                style={{ fontFamily: 'Abril Fatface, serif' }}>
              {categoryData.name}
            </h1>
            <div className="text-xl text-gray-600 max-w-3xl mx-auto">
              {categoryData.slug === 'hombre' ? (
                <>
                  <p className="mb-4">
                    Descubre las últimas tendencias en <strong>moda masculina</strong>, consejos de estilo y <strong>outfits para hombre</strong>.
                    Desde looks casuales hasta vestuario formal, aquí encontrarás inspiración para cada ocasión.
                  </p>
                  <p>
                    Aprende a combinar prendas, elegir el calzado perfecto y crear tu propio estilo único.
                    Guías de <strong>cortes de pelo</strong>, <strong>tipos de rostro</strong> y consejos de grooming para el hombre moderno.
                  </p>
                </>
              ) : categoryData.slug === 'mujer' ? (
                <>
                  <p className="mb-4">
                    Explora las últimas tendencias en <strong>moda femenina</strong>, consejos de estilo y <strong>outfits para mujer</strong>.
                    Desde looks elegantes hasta estilos casuales, encuentra inspiración para lucir espectacular en cada momento.
                  </p>
                  <p>
                    Descubre cómo combinar colores, texturas y accesorios para crear tu estilo personal.
                    Tips de <strong>belleza</strong>, <strong>maquillaje</strong> y consejos de moda para la mujer moderna y elegante.
                  </p>
                </>
              ) : categoryData.slug === 'moda' ? (
                <>
                  <p className="mb-4">
                    Sumérgete en el universo de la <strong>alta costura</strong>, las <strong>semanas de la moda</strong> y los diseñadores
                    que marcan tendencia en cada temporada.
                  </p>
                  <p>
                    Descubre colaboraciones especiales, colecciones cápsula y reportes desde Milán, París y Nueva York para inspirar tu
                    próximo look con visión editorial.
                  </p>
                </>
              ) : categoryData.slug === 'recomendaciones' ? (
                <>
                  <p className="mb-4">
                    Explora nuestras <strong>recomendaciones destacadas</strong>: colecciones cápsula, lanzamientos especiales,
                    colaboraciones y productos que elevan cualquier guardarropa.
                  </p>
                  <p>
                    Curamos reseñas sinceras, guías de compra y selecciones de temporada para ayudarte a elegir con confianza.
                    Inspírate con propuestas versátiles para mujeres y hombres en busca de estilo con propósito.
                  </p>
                </>
              ) : (
                <p>{categoryData.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {categoryData.slug === 'hombre'
                  ? 'Guías de Moda Masculina y Estilo para Hombre'
                  : categoryData.slug === 'mujer'
                  ? 'Guías de Moda Femenina y Estilo para Mujer'
                  : categoryData.slug === 'moda'
                  ? 'Reportes y tendencias del mundo fashion'
                  : categoryData.slug === 'recomendaciones'
                  ? 'Selección curada de recomendaciones'
                  : `Artículos de ${categoryData.name}`}
              </h2>
              <div className={`columns-1 md:columns-2 lg:columns-3 gap-8 pb-12 ${posts.length > 10 ? 'masonry-enhanced' : ''}`}>
                {posts.map((post, index) => {
                  const heights = posts.length > 10
                    ? ['h-56', 'h-72', 'h-64', 'h-88', 'h-80', 'h-96', 'h-68', 'h-104', 'h-76', 'h-92', 'h-84', 'h-112', 'h-60', 'h-100', 'h-108', 'h-120', 'h-52', 'h-84', 'h-74', 'h-116', 'h-66', 'h-128', 'h-58', 'h-94']
                    : ['h-80', 'h-104', 'h-88', 'h-96', 'h-112', 'h-84', 'h-72', 'h-100', 'h-76', 'h-108', 'h-92', 'h-116'];
                  const imageHeight = heights[index % heights.length];

                  return (
                    <article
                      key={post.id}
                      className={`break-inside-avoid ${posts.length > 10 ? 'mb-22' : 'mb-22'} bg-white shadow-sm border border-gray-100 rounded-[15px]`}
                    >
                      {/* Featured Image */}
                      <Link href={`/${category}/${post.slug}`}>
                        <div className="relative cursor-pointer">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className={`w-full ${imageHeight} object-cover rounded-[10px]`}
                            />
                          ) : (
                            <div className={`w-full ${imageHeight} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-[10px]`}>
                              <span className="text-gray-400 text-sm">Imagen del artículo</span>
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-[6px]">
                              {categoryData.name}
                            </span>
                          </div>

                          {/* Content overlay */}
                          <div className="absolute bottom-0 left-0 right-0 mx-3 translate-y-1/2">
                            <div className="bg-white p-3 shadow-md rounded-[8px]">
                              <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 leading-tight capitalize"
                                  style={{ fontFamily: 'Abril Fatface, serif' }}>
                                {post.title.toLowerCase()}
                              </h3>

                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {post.excerpt}
                              </p>

                              <span className="text-xs font-bold text-gray-600">
                                Leer más →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  🚧 Contenido en Desarrollo
                </h2>
                <p className="text-gray-600 mb-4">
                  Estamos preparando contenido específico para la categoría de {categoryData.name.toLowerCase()}.
                </p>
                <p className="text-sm text-gray-500">
                  Pronto encontrarás aquí artículos sobre tendencias, consejos de estilo y mucho más.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
