'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Post } from '@/app/types';

interface BlogCarouselProps {
  posts: Post[];
  autoPlay?: boolean;
  interval?: number;
}

export default function BlogCarousel({ posts, autoPlay = true, interval = 5000 }: BlogCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || posts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, posts.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay artículos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-xl bg-gradient-to-br from-cream-100 to-beige-100">
      {/* Carousel Items */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posts.map((post, index) => (
          <div key={post.id} className="min-w-full h-full relative">
            <Link href={`/${post.categories[0]?.slug || 'articulo'}/${post.slug}`}>
              <div className="h-full bg-gradient-to-r from-cream-200 via-beige-100 to-cream-200 p-6 md:p-8 flex items-center justify-center overflow-y-auto">
                <div className="max-w-4xl mx-auto text-center py-8">

                  {/* Category Badge */}
                  <div className="mb-4">
                    {post.categories.slice(0, 2).map((category) => (
                      <span
                        key={category.id}
                        className="inline-block px-3 py-1 bg-white/80 text-gray-700 text-sm rounded-full font-medium mr-2"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl text-gray-800 mb-3 leading-tight group-hover:text-beige-700 transition-colors"
                    style={{ fontFamily: 'var(--font-abril-fatface)' }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-base md:text-lg mb-4 leading-relaxed max-w-2xl mx-auto">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4 space-x-4">
                    <time>
                      {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
                    </time>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>

                  {/* Read More Button */}
                  <div className="inline-flex items-center bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors font-medium group">
                    Leer artículo
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Artículo anterior"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="Siguiente artículo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

    </div>
  );
}