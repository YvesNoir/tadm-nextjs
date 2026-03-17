import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories } from '@/app/lib/categories';

export default function Footer() {
  const categories = getAllCategories();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[36px] border border-black/6 bg-white/18 shadow-[0_28px_80px_rgba(49,31,19,0.10)] backdrop-blur-xl">
        <div className="grid gap-12 px-6 py-10 sm:px-8 lg:grid-cols-[1.35fr_0.85fr_0.85fr_1fr] lg:px-10 lg:py-12">
          <div className="flex flex-col justify-between">
            <div>
              <Link href="/" className="mb-[10px] inline-flex items-center">
                <Image
                  src="/tuasesordemoda-logo.svg"
                  alt="TuAsesorDeModa"
                  width={300}
                  height={90}
                  className="w-auto"
                  style={{ height: '3.1rem' }}
                />
              </Link>

              <p className="mt-5 max-w-md text-base leading-8 text-neutral-600">
                Un blog editorial sobre moda, estilo, belleza y recomendaciones pensado para descubrir artículos con una estética más limpia y una navegación más cuidada.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/blog"
                className="rounded-full border border-[#d9c9b7] bg-[#f5eadc] px-4 py-2 text-sm font-medium text-[#53372a] transition-colors hover:bg-[#efe1cf]"
              >
                Ver blog
              </Link>
              <Link
                href="/sitemap.xml"
                className="rounded-full border border-[#d9c9b7] bg-[#f7efe5] px-4 py-2 text-sm font-medium text-[#53372a] transition-colors hover:bg-[#f1e4d6]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sitemap
              </Link>
            </div>
          </div>

          <div>
            <h3
              className="text-2xl leading-none text-neutral-900"
            >
              Categorías
            </h3>
            <ul className="mt-6 space-y-3">
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-[1rem] text-neutral-600 transition-colors hover:text-[#ad4032]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-2xl leading-none text-neutral-900"
            >
              Explorar
            </h3>
            <ul className="mt-6 space-y-3">
              {categories.slice(4).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/${category.slug}`}
                    className="text-[1rem] text-neutral-600 transition-colors hover:text-[#ad4032]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/robots.txt"
                  className="text-[1rem] text-neutral-600 transition-colors hover:text-[#ad4032]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Robots
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="text-2xl leading-none text-neutral-900"
            >
              Tu Asesor de Moda
            </h3>
            <p className="mt-6 text-base leading-8 text-neutral-600">
              Una portada cálida, editorial y enfocada en moda femenina, masculina, belleza y hallazgos que vale la pena guardar.
            </p>

            <div className="mt-6 rounded-full border border-[#d9c9b7] bg-white/30 p-1 shadow-[0_12px_30px_rgba(49,31,19,0.05)]">
              <div className="flex items-center justify-between gap-3 rounded-full px-4 py-3">
                <span className="text-sm text-neutral-500">Nuevos artículos cada semana</span>
                <Link
                  href="/blog"
                  className="rounded-full border border-[#d9c9b7] bg-[#f5eadc] px-4 py-2 text-sm font-semibold text-[#53372a] transition-colors hover:bg-[#efe1cf]"
                >
                  Entrar
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/6 bg-white/8 px-6 py-5 sm:px-8 lg:px-10 backdrop-blur-xl">
          <div className="flex flex-col gap-4 text-sm text-neutral-600 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/favi-tadm.png"
                alt="TuAsesorDeModa"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span>© {currentYear} TuAsesorDeModa. Todos los derechos reservados.</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link href="/blog" className="transition-colors hover:text-[#ad4032]">
                Blog
              </Link>
              <Link
                href="/sitemap.xml"
                className="transition-colors hover:text-[#ad4032]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sitemap
              </Link>
              <Link
                href="/robots.txt"
                className="transition-colors hover:text-[#ad4032]"
                target="_blank"
                rel="noopener noreferrer"
              >
                Robots
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
