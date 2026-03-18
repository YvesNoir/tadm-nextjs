import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@/app/types';
import TableOfContents from '@/app/components/blog/TableOfContents';
import BlogContentWithModal from '@/app/components/blog/BlogContentWithModal';
import RelatedPosts from '@/app/components/blog/RelatedPosts';
import AdSlot from '@/app/components/ads/AdSlot';
import { buildArticleBlocks } from '@/app/lib/articleAds';

interface PostArticleLayoutProps {
  post: Post;
  category: Category;
  content: string;
  relatedPosts: Post[];
}

export default function PostArticleLayout({
  post,
  category,
  content,
  relatedPosts,
}: PostArticleLayoutProps) {
  const articleInlineSlot =
    process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_INLINE_SLOT || '2067945153';
  const articleBottomSlot =
    process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_BOTTOM_SLOT || '4617287145';
  const { blocks, showBottomAd } = buildArticleBlocks(content);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Inicio
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link href={`/${category.slug}`} className="hover:text-gray-700">
                {category.name}
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-900">{post.title}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-10 lg:gap-8">
          <div className="lg:col-span-7">
            <article>
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              {post.coverImage ? (
                <div className="mb-10 overflow-hidden rounded-[28px] border border-black/5 bg-[#f8f4ef] shadow-[0_18px_40px_rgba(49,31,19,0.08)]">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={1400}
                    height={900}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>
              ) : null}

              {blocks.map((block, index) =>
                block.type === 'content' ? (
                  <BlogContentWithModal key={`content-${index}`} content={block.html} />
                ) : (
                  <AdSlot
                    key={block.key}
                    slot={articleInlineSlot}
                    variant="in-article"
                  />
                )
              )}

              {showBottomAd ? <AdSlot slot={articleBottomSlot} variant="multiplex" /> : null}

              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Categorías relacionadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/${cat.slug}`}
                          className="px-3 py-1 bg-background-soft text-primary text-sm rounded-full hover:bg-secondary hover:text-white transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/${category.slug}`}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Ver más en {category.name}
                  </Link>
                </div>
              </footer>

              <RelatedPosts posts={relatedPosts} />
            </article>
          </div>

          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <TableOfContents content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
