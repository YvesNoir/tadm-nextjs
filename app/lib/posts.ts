import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post, Category } from '@/app/types';
import { getCategoryBySlug } from './categories';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Convert categories array to Category objects
    const categories: Category[] = (data.categories || [])
      .map((categorySlug: string) => getCategoryBySlug(categorySlug))
      .filter((category: Category | undefined): category is Category => category !== undefined);

    return {
      id: realSlug,
      slug: realSlug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content,
      coverImage: data.coverImage,
      author: data.author || 'TuAsesorDeModa',
      publishedAt: new Date(data.date || Date.now()),
      updatedAt: new Date(data.updatedAt || data.date || Date.now()),
      categories,
      tags: data.tags || [],
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      featured: data.featured || false,
      status: data.status || 'published',
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export async function getPostContent(slug: string): Promise<string> {
  const post = getPostBySlug(slug);
  if (!post) return '';

  const processedContent = await remark()
    .use(html, {
      sanitize: false,  // Allow raw HTML
      allowDangerousHtml: true  // Allow potentially dangerous HTML
    })
    .process(post.content);

  return processedContent.toString();
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug.replace(/\.md$/, '')))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.publishedAt > post2.publishedAt ? -1 : 1));

  return posts;
}

export function getPostsByCategory(categorySlug: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post =>
    post.categories.some(category => category.slug === categorySlug)
  );
}

export function getFeaturedPosts(limit: number = 6): Post[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter(post => post.featured)
    .slice(0, limit);
}

export function getLatestPosts(limit: number = 5): Post[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter(post => post.status === 'published')
    .slice(0, limit);
}

export function getRelatedPosts(currentPostSlug: string, currentCategorySlug: string, limit: number = 3): Post[] {
  const currentPost = getPostBySlug(currentPostSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts();

  // Filter to only include posts from the same specific category
  const relatedPosts = allPosts
    .filter(post =>
      post.slug !== currentPostSlug &&
      post.status === 'published' &&
      post.categories.some(category => category.slug === currentCategorySlug)
    );

  // Shuffle the array to get random selection
  const shuffled = relatedPosts.sort(() => Math.random() - 0.5);

  // Return the first 'limit' posts
  return shuffled.slice(0, limit);
}