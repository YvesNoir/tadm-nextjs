import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPostContent, getRelatedPosts } from '@/app/lib/posts';
import { getCategoryBySlug } from '@/app/lib/categories';
import { Metadata } from 'next';
import TableOfContents from '@/app/components/blog/TableOfContents';
import BlogContentWithModal from '@/app/components/blog/BlogContentWithModal';
import RelatedPosts from '@/app/components/blog/RelatedPosts';

interface PostPageProps {
  params: Promise<{
    category: string;
    post: string;
  }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { post } = await params;
  const postData = getPostBySlug(post);

  if (!postData) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: postData.seoTitle || `${postData.title} - TuAsesorDeModa`,
    description: postData.seoDescription || postData.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, post } = await params;
  const postData = getPostBySlug(post);
  const categoryData = getCategoryBySlug(category);

  if (!postData || !categoryData) {
    notFound();
  }

  const content = await getPostContent(post);
  const relatedPosts = getRelatedPosts(post, category, 3);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Inicio
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link href={`/${category}`} className="hover:text-gray-700">
                {categoryData.name}
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-900">{postData.title}</li>
          </ol>
        </nav>

        {/* Main Content Layout */}
        <div className="lg:grid lg:grid-cols-10 lg:gap-8">
          {/* Main Content - 70% */}
          <div className="lg:col-span-7">
            <article>
              {/* Post Header */}
              <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight"
                    style={{ fontFamily: 'Abril Fatface, serif' }}>
                  {postData.title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {postData.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>


              {/* Post Content */}
              <BlogContentWithModal content={content} />

              {/* Post Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Categorías relacionadas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {postData.categories.map((cat) => (
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
                    href={`/${category}`}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Ver más en {categoryData.name}
                  </Link>
                </div>
              </footer>

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} currentCategory={category} />
            </article>
          </div>

          {/* Table of Contents Sidebar - 30% */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <TableOfContents content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}