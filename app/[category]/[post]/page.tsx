import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug, getPostContent, getRelatedPosts } from '@/app/lib/posts';
import { getCategoryBySlug } from '@/app/lib/categories';
import { Metadata } from 'next';
import PostArticleLayout from '@/app/components/blog/PostArticleLayout';
import { createPostMetadata } from '@/app/lib/seo';

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
    ...createPostMetadata(postData),
    robots: postData.status === 'draft'
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  };
}

export function generateStaticParams() {
  return getAllPosts()
    .flatMap((post) =>
      post.categories.map((category) => ({
        category: category.slug,
        post: post.slug,
      }))
    );
}

export const dynamicParams = false;

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
    <PostArticleLayout
      post={postData}
      category={categoryData}
      content={content}
      relatedPosts={relatedPosts}
    />
  );
}
