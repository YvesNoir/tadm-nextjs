'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAllCategories } from '@/app/lib/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const categories = getAllCategories().filter((category) =>
    ['mujer', 'hombre', 'belleza', 'recomendaciones'].includes(category.slug)
  );
  const knownRootPaths = new Set([
    '',
    'blog',
    'buscar',
    'robots.txt',
    'sitemap.xml',
    ...categories.map((category) => category.slug),
  ]);
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '');
  const isArticlePage = normalizedPath.length > 0 && !knownRootPaths.has(normalizedPath) && !normalizedPath.includes('/');

  return (
    <header className={`relative z-40 px-4 pt-4 sm:px-6 lg:px-8 ${isArticlePage ? 'bg-white' : ''}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex h-20 items-center justify-between gap-6 rounded-full border border-black/6 bg-white/45 px-5 shadow-[0_18px_40px_rgba(49,31,19,0.08)] backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/tuasesordemoda-logo.svg"
              alt="TuAsesorDeModa"
              width={300}
              height={90}
              className="w-auto"
              style={{ height: '3.6rem' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-3 rounded-full bg-transparent px-1 py-1 md:flex">
            <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-[#f3e8dd]">
              Home
            </Link>
            <Link href="/mujer" className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#f3e8dd] hover:text-neutral-950">
              Mujer
            </Link>
            <Link href="/hombre" className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#f3e8dd] hover:text-neutral-950">
              Hombre
            </Link>
            <Link href="/blog" className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-[#f3e8dd] hover:text-neutral-950">
              Blog
            </Link>
          </nav>

          <Link
            href="/blog"
            className="hidden rounded-full border border-[#d9c9b7] bg-[#f5eadc] px-5 py-3 text-sm font-semibold text-[#53372a] shadow-[0_12px_24px_rgba(49,31,19,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#efe1cf] md:inline-flex"
          >
            Ver articulos
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full border border-black/8 bg-white/60 p-3 text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mt-3 rounded-[28px] border border-black/6 bg-white/55 p-3 shadow-[0_18px_40px_rgba(49,31,19,0.08)] backdrop-blur-xl md:hidden">
            <nav className="space-y-1">
              <Link
                href="/blog"
                className="block rounded-2xl px-3 py-3 text-base font-medium text-gray-900 hover:bg-[#f3e8dd]"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="block rounded-2xl px-3 py-3 text-base font-medium text-gray-700 hover:bg-[#f3e8dd] hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
