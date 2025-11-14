import Link from "next/link";
import { getAllCategories } from "./lib/categories";
import { getFeaturedPosts, getLatestPosts } from "./lib/posts";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import BlogCarousel from "./components/ui/BlogCarousel";

export default function Home() {
  const categories = getAllCategories();
  const latestPosts = getLatestPosts(5);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-100 to-beige-100 py-20 sm:py-32 overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-cream-200/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-beige-200/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cream-300/30 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[600px]">

            {/* Left decorative circle */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="w-40 h-40 xl:w-48 xl:h-48 rounded-full bg-gradient-to-br from-cream-200 to-beige-200 opacity-60 flex items-center justify-center">
                <div className="w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-beige-100 to-cream-100 opacity-80"></div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-8 text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-gray-800 mb-8 leading-tight" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                Diseñado para el
                <span className="block text-beige-700 italic">estilo</span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                  La moda es una elección
                </span>
              </h1>

              {/* Central circular image placeholder */}
              <div className="relative mx-auto mb-12">
                <div className="w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-full bg-gradient-to-br from-beige-200 to-cream-300 flex items-center justify-center shadow-2xl">
                  <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-cream-100 to-beige-100 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Imagen principal</span>
                  </div>
                </div>

                {/* Floating social icons */}
                <div className="absolute top-4 -right-8 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <span className="text-xs text-gray-600">Facebook</span>
                </div>
                <div className="absolute bottom-12 -right-12 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <span className="text-xs text-gray-600">Instagram</span>
                </div>
                <div className="absolute bottom-4 -left-8 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                  <span className="text-xs text-gray-600">TikTok</span>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <p className="text-gray-600 text-sm leading-relaxed mb-8">
                  Descubre las últimas tendencias y consejos de estilo.
                  Tu guía completa para estar siempre a la moda con elegancia y personalidad.
                </p>
              </div>
            </div>

            {/* Right decorative circle */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="w-40 h-40 xl:w-48 xl:h-48 rounded-full bg-gradient-to-br from-beige-200 to-cream-200 opacity-60 flex items-center justify-center ml-auto">
                <div className="w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-gradient-to-br from-cream-100 to-beige-100 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Styled like the reference */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">

            {/* Belleza */}
            <div className="text-center group">
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-beige-400 text-lg font-light">01</span>
                <Link href="/belleza" className="block">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 hover:text-beige-600 transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                    Belleza
                  </h3>
                </Link>
              </div>
              <div className="w-16 h-px bg-beige-300 mx-auto mt-4"></div>
            </div>

            {/* Fashion */}
            <div className="text-center group">
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-beige-400 text-lg font-light">02</span>
                <Link href="/mujer" className="block">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 hover:text-beige-600 transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                    Fashion
                  </h3>
                </Link>
              </div>
              <div className="w-16 h-px bg-beige-300 mx-auto mt-4"></div>
            </div>

            {/* Estilo */}
            <div className="text-center group">
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-beige-400 text-lg font-light">03</span>
                <Link href="/hombre" className="block">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 hover:text-beige-600 transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                    Estilo
                  </h3>
                </Link>
              </div>
              <div className="w-16 h-px bg-beige-300 mx-auto mt-4"></div>
            </div>

            {/* Calzado */}
            <div className="text-center group">
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-beige-400 text-lg font-light">04</span>
                <Link href="/zapatos" className="block">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 hover:text-beige-600 transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                    Calzado
                  </h3>
                </Link>
              </div>
              <div className="w-16 h-px bg-beige-300 mx-auto mt-4"></div>
            </div>

            {/* Lifestyle */}
            <div className="text-center group">
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-beige-400 text-lg font-light">05</span>
                <Link href="/salud" className="block">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 hover:text-beige-600 transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                    Lifestyle
                  </h3>
                </Link>
              </div>
              <div className="w-16 h-px bg-beige-300 mx-auto mt-4"></div>
            </div>

            {/* Perfumes */}
            <div className="text-center group">
              <div className="relative">
                <span className="absolute -top-4 -left-4 text-beige-400 text-lg font-light">06</span>
                <Link href="/perfumes" className="block">
                  <h3 className="text-4xl md:text-5xl lg:text-6xl text-gray-800 hover:text-beige-600 transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
                    Perfumes
                  </h3>
                </Link>
              </div>
              <div className="w-16 h-px bg-beige-300 mx-auto mt-4"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Latest Blog Posts Carousel */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-gray-800 mb-6" style={{ fontFamily: 'var(--font-abril-fatface)' }}>
              Últimos Artículos
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubre nuestros artículos más recientes sobre moda, estilo y tendencias
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <BlogCarousel posts={latestPosts} autoPlay={true} interval={6000} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🚧 Contenido Próximamente
              </h3>
              <p className="text-gray-600">
                Estamos preparando contenido increíble para ti. Pronto tendrás acceso a
                artículos de moda, guías de estilo y las últimas tendencias.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
