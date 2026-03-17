import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/app/types';
import { getPostPath } from '@/app/lib/posts';
import { ebGaramond } from '@/app/lib/fonts';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">
        Artículos relacionados
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-[10px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <Link href={getPostPath(post.slug)}>
              <div className="cursor-pointer">
                {/* Featured Image */}
                <div className="relative">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="w-full h-48 object-cover rounded-t-[10px]"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-[10px]">
                      <span className="text-gray-400 text-sm">Imagen del artículo</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-[6px]">
                      {post.categories[0]?.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className={`${ebGaramond.className} text-lg font-semibold text-primary mb-2 line-clamp-2 leading-tight capitalize`}>
                    <span className={`${ebGaramond.className} font-[inherit]`}>
                      {post.title.toLowerCase()}
                    </span>
                  </h4>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <span className="text-sm font-bold text-primary hover:text-secondary transition-colors">
                    Leer más →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
