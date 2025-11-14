'use client';

import { useEffect, useState } from 'react';
import ImageModal from './ImageModal';

interface BlogContentWithModalProps {
  content: string;
}

export default function BlogContentWithModal({ content }: BlogContentWithModalProps) {
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const handleContentClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const imgElement = target as HTMLImageElement;
        e.preventDefault();
        e.stopPropagation();
        setModalImage({
          src: imgElement.src,
          alt: imgElement.alt || 'Imagen del artículo'
        });
      }
    };

    // Use event delegation on the container instead of individual images
    const timer = setTimeout(() => {
      const blogContent = document.querySelector('.blog-content');
      if (blogContent) {
        // Set cursor for all images
        const images = blogContent.querySelectorAll('img');
        images.forEach(img => {
          img.style.cursor = 'pointer';
        });

        // Add single listener to the container using event delegation
        blogContent.addEventListener('click', handleContentClick);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const blogContent = document.querySelector('.blog-content');
      if (blogContent) {
        blogContent.removeEventListener('click', handleContentClick);
      }
    };
  }, [content]);

  return (
    <>
      <div
        className="blog-content prose prose-lg max-w-none"
        style={{
          color: '#000000'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <ImageModal
        src={modalImage?.src || ''}
        alt={modalImage?.alt || ''}
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
      />
    </>
  );
}