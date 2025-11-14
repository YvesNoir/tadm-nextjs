import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/app/lib/categories';

export default function Footer() {
  const categories = getAllCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-gray-800 bg-cover bg-center bg-no-repeat min-h-[400px]"
      style={{
        backgroundImage: 'url(/images/background-footer.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/images/tuasesordemoda-logo-white.svg"
                alt="TuAsesorDeModa"
                width={270}
                height={75}
                className="w-auto"
                style={{ height: '3.75rem' }}
              />
            </Link>
            <p className="text-white text-sm max-w-md opacity-90">
              Tu guía completa de moda, estilo y tendencias. Descubre las últimas
              novedades en moda masculina y femenina, belleza, calzado y mucho más.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Categorías
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 3).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-white hover:text-gray-300 text-sm transition-colors opacity-90 hover:opacity-100"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Más Categorías
            </h3>
            <ul className="space-y-2">
              {categories.slice(3).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-white hover:text-gray-300 text-sm transition-colors opacity-90 hover:opacity-100"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white border-opacity-20 pt-8">
          <p className="text-white text-sm text-center opacity-75">
            © {currentYear} TuAsesorDeModa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
