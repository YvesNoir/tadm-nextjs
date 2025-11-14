'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { getAllCategories } from '@/app/lib/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = getAllCategories();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/tuasesordemoda-logo.svg"
              alt="TuAsesorDeModa"
              width={300}
              height={90}
              className="w-auto"
              style={{ height: '4.5rem' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-primary hover:opacity-80 text-base font-bold transition-colors uppercase"
                  style={{ fontFamily: 'Abril Fatface, serif' }}>
              HOME
            </Link>
            <Link href="/mujer" className="text-primary hover:opacity-80 text-base font-bold transition-colors uppercase"
                  style={{ fontFamily: 'Abril Fatface, serif' }}>
              MUJER
            </Link>
            <Link href="/hombre" className="text-primary hover:opacity-80 text-base font-bold transition-colors uppercase"
                  style={{ fontFamily: 'Abril Fatface, serif' }}>
              HOMBRE
            </Link>
            <Link href="/moda" className="text-primary hover:opacity-80 text-base font-bold transition-colors uppercase"
                  style={{ fontFamily: 'Abril Fatface, serif' }}>
              MODA
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
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
          <div className="md:hidden border-t border-gray-200">
            <nav className="pt-2 pb-3 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
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
