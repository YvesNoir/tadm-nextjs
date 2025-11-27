import Link from "next/link";
import { getAllCategories } from "./lib/categories";
import { getFeaturedPosts, getLatestPosts } from "./lib/posts";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Home() {
  const categories = getAllCategories();
  const allLatestPosts = getLatestPosts(50); // Aumentamos para tener más opciones
  const featuredPosts = getFeaturedPosts();

  const formatSafeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Sin fecha';
      }
      return format(date, 'd MMM, yyyy', { locale: es });
    } catch {
      return 'Sin fecha';
    }
  };

  // Función para mezclar posts alternando 2 de mujer y 2 de hombre
  const getMixedPosts = () => {
    const mujerPosts = allLatestPosts.filter(post =>
      post.categories?.some(cat => cat.slug === 'mujer') &&
      !post.categories?.some(cat => cat.slug === 'recomendaciones')
    );
    const hombrePosts = allLatestPosts.filter(post =>
      post.categories?.some(cat => cat.slug === 'hombre') &&
      !post.categories?.some(cat => cat.slug === 'recomendaciones')
    );

    const mixedPosts = [];
    let mujerIndex = 0;
    let hombreIndex = 0;

    for (let i = 0; i < 12; i++) {
      if (i % 4 < 2) {
        // Agregar 2 posts de mujer
        if (mujerIndex < mujerPosts.length) {
          mixedPosts.push(mujerPosts[mujerIndex]);
          mujerIndex++;
        }
      } else {
        // Agregar 2 posts de hombre
        if (hombreIndex < hombrePosts.length) {
          mixedPosts.push(hombrePosts[hombreIndex]);
          hombreIndex++;
        }
      }
    }

    // Si no hay suficientes posts de una categoría, rellenar con la otra
    while (mixedPosts.length < 12) {
      if (mujerIndex < mujerPosts.length) {
        mixedPosts.push(mujerPosts[mujerIndex]);
        mujerIndex++;
      } else if (hombreIndex < hombrePosts.length) {
        mixedPosts.push(hombrePosts[hombreIndex]);
        hombreIndex++;
      } else {
        break;
      }
    }

    return mixedPosts;
  };

  const mixedPosts = getMixedPosts();

  // Para el hero, obtener 2 de mujer y 2 de hombre específicamente
  const getHeroPosts = () => {
    const mujerPosts = allLatestPosts.filter(post =>
      post.categories?.some(cat => cat.slug === 'mujer') &&
      !post.categories?.some(cat => cat.slug === 'recomendaciones')
    );
    const hombrePosts = allLatestPosts.filter(post =>
      post.categories?.some(cat => cat.slug === 'hombre') &&
      !post.categories?.some(cat => cat.slug === 'recomendaciones')
    );

    const heroPosts = [];

    // Agregar 2 de mujer
    heroPosts.push(...mujerPosts.slice(0, 2));

    // Agregar 2 de hombre
    heroPosts.push(...hombrePosts.slice(0, 2));

    return heroPosts;
  };

  const heroLatestPosts = getHeroPosts();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#bf685c' }}>

      {/* Hero Section with Real Content */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full blur-xl" style={{ background: 'linear-gradient(to bottom right, #ad4032, #c2523e)', opacity: 0.3 }}></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 rounded-full blur-xl" style={{ background: 'linear-gradient(to bottom right, #e7872c, #ad4032)', opacity: 0.3 }}></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                  Moda que
                  <span className="block text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #e7872c, #c2523e, #ad4032)' }}>
                    inspira
                  </span>
                  <span className="block text-gray-600">tu estilo</span>
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed max-w-lg">
                  Descubre las tendencias más exclusivas, consejos de estilo y outfits que transformarán tu manera de vestir.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/mujer"
                  className="text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-center"
                  style={{
                    background: 'linear-gradient(to right, #e7872c, #c2523e)',
                    boxShadow: '0 4px 15px rgba(173, 64, 50, 0.3)'
                  }}
                >
                  Explorar Moda Mujer
                </Link>
                <Link
                  href="/hombre"
                  className="px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 text-center"
                  style={{
                    border: '2px solid #ad4032',
                    color: '#ad4032'
                  }}
                >
                  Ver Estilo Hombre
                </Link>
              </div>
            </div>

            {/* Right Content - Featured Articles Grid */}
            <div className="grid grid-cols-2 gap-4">
              {heroLatestPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/${post.categories?.[0]?.slug || 'mujer'}/${post.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-gray-800 hover:scale-105 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgba(173, 64, 50, 0.2), rgba(231, 135, 44, 0.2))' }}></div>
                  <img
                    src={post.coverImage || '/images/placeholder.jpg'}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#e7872c' }}>
                        {post.categories?.[0]?.name || 'Moda'}
                      </span>
                    </div>
                    <h3 className="text-white text-sm font-bold leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  {/* Number indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20" style={{ backgroundColor: 'rgba(173, 64, 50, 0.1)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
              Explora por Categorías
            </h2>
            <p className="text-gray-300 text-lg">
              Encuentra exactamente lo que buscas para tu estilo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mujer */}
            <Link href="/mujer" className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to bottom right, #c2523e, #ad4032)' }}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                  Mujer
                </h3>
                <p className="text-white/90 text-sm">
                  Tendencias, outfits y consejos de estilo femenino
                </p>
              </div>
              <div className="absolute top-4 right-4 text-white/60">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>

            {/* Hombre */}
            <Link href="/hombre" className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to bottom right, #bf685c, #ad4032)' }}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                  Hombre
                </h3>
                <p className="text-white/90 text-sm">
                  Elegancia masculina y looks sofisticados
                </p>
              </div>
              <div className="absolute top-4 right-4 text-white/60">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>

            {/* Belleza */}
            <Link href="/belleza" className="group relative overflow-hidden rounded-2xl aspect-[4/5] hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(to bottom right, #e7872c, #c2523e)' }}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                  Belleza
                </h3>
                <p className="text-white/90 text-sm">
                  Tips de maquillaje, cuidado y bienestar
                </p>
              </div>
              <div className="absolute top-4 right-4 text-white/60">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Articles Masonry */}
      <section className="py-20" style={{ backgroundColor: '#bf685c' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                Últimas Tendencias
              </h2>
              <p className="text-gray-300 text-lg">
                No te pierdas nuestros artículos más recientes
              </p>
            </div>
            <Link
              href="/blog"
              className="font-semibold flex items-center transition-colors"
              style={{ color: '#e7872c' }}
            >
              Ver todos
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {mixedPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/${post.categories?.[0]?.slug || 'mujer'}/${post.slug}`}
                className="block break-inside-avoid mb-6 group"
              >
                <article className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-all duration-300 hover:scale-[1.02]">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={post.coverImage || '/images/placeholder.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.categories?.[0]?.name || 'Moda'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-white text-lg font-bold mb-3 leading-tight transition-colors line-clamp-2 group-hover:text-orange-300" style={{ '&:hover': { color: '#e7872c' } }}>
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatSafeDate(post.date)}</span>
                      <span className="flex items-center">
                        Leer más
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20" style={{ background: 'linear-gradient(to right, #e7872c, #c2523e, #ad4032)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
            No te pierdas las últimas tendencias
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Suscríbete para recibir consejos de moda, outfits exclusivos y las tendencias más actuales directamente en tu inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-2 focus:ring-white/50 focus:outline-none"
            />
            <button className="px-8 py-4 rounded-full font-semibold transition-colors whitespace-nowrap" style={{ backgroundColor: 'white', color: '#ad4032', '&:hover': { backgroundColor: '#f5f5f5' } }}>
              Suscribirme
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
