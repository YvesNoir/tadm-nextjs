import { Suspense } from 'react';
import Link from 'next/link';
import { getAllPosts } from '@/app/lib/posts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import SearchBox from '@/app/components/ui/SearchBox';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

function SearchResults({ query }: { query: string }) {
  const allPosts = getAllPosts();

  // Simple search function - busca en título, excerpt y tags
  const searchResults = allPosts.filter((post) => {
    const searchTerm = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.categories.some(cat => cat.name.toLowerCase().includes(searchTerm))
    );
  });

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          No se encontraron resultados
        </h2>
        <p className="text-gray-600 mb-8">
          No se encontraron artículos para "{query}". Intenta con otros términos de búsqueda.
        </p>
        <div className="max-w-md mx-auto">
          <SearchBox placeholder="Buscar otros términos..." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{query}"
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {searchResults.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Imagen del artículo</span>
            </div>
            <div className="p-6">
              <div className="mb-2">
                <time className="text-sm text-gray-500">
                  {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                </time>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link
                  href={`/${post.categories[0]?.slug || 'articulo'}/${post.slug}`}
                  className="hover:text-gray-700 transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.slice(0, 2).map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link
                href={`/${post.categories[0]?.slug || 'articulo'}/${post.slug}`}
                className="text-black font-medium text-sm hover:underline"
              >
                Leer más →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = '' } = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Buscar Artículos
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Encuentra artículos sobre moda, estilo y tendencias
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBox
                placeholder="Buscar artículos sobre moda..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="text-gray-500">Buscando artículos...</div>
            </div>
          }>
            {query ? (
              <SearchResults query={query} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  ¿Qué estás buscando?
                </h2>
                <p className="text-gray-600 mb-8">
                  Utiliza el buscador de arriba para encontrar artículos sobre tus temas favoritos
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
                  <Link
                    href="/buscar?q=tendencias"
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
                  >
                    Tendencias
                  </Link>
                  <Link
                    href="/buscar?q=zapatos"
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
                  >
                    Zapatos
                  </Link>
                  <Link
                    href="/buscar?q=belleza"
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
                  >
                    Belleza
                  </Link>
                  <Link
                    href="/buscar?q=outfits"
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
                  >
                    Outfits
                  </Link>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  );
}