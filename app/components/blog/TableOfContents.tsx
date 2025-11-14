'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Wait for content to be rendered, then find and process headings
    const processHeadings = () => {
      const contentElement = document.querySelector('.blog-content');
      if (!contentElement) return;

      const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const parsedHeadings: Heading[] = [];

      headingElements.forEach((heading, index) => {
        const text = heading.textContent || '';
        const level = parseInt(heading.tagName.charAt(1));
        const id = `heading-${index}`;

        // Add ID directly to the existing heading in the DOM
        heading.id = id;

        parsedHeadings.push({ id, text, level });
      });

      setHeadings(parsedHeadings);
    };

    // Process headings after content is rendered
    const timer = setTimeout(processHeadings, 100);

    // Also watch for DOM changes
    const contentElement = document.querySelector('.blog-content');
    if (contentElement) {
      const observer = new MutationObserver(() => {
        setTimeout(processHeadings, 50);
      });

      observer.observe(contentElement, {
        childList: true,
        subtree: true
      });

      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    // Intersection Observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -80% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-8">
      <div className="bg-white">
        <h2 className="text-2xl font-bold text-primary mb-8">
          Tabla de contenidos
        </h2>
        <nav className="space-y-3">
          {headings.map((heading, index) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl transition-all duration-200 hover:border-secondary hover:bg-background-soft ${
                activeId === heading.id
                  ? 'border-primary bg-background-soft text-primary'
                  : 'text-gray-700 bg-white'
              }`}
              style={{
                marginLeft: `${(heading.level - 1) * 0.75}rem`
              }}
            >
              <span className="text-left flex-1 font-medium">
                {heading.text}
              </span>
              <span className={`ml-4 px-3 py-1 rounded-lg text-sm font-semibold min-w-[2.5rem] text-center ${
                activeId === heading.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}