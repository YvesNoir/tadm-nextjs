import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { cache } from 'react';
import { Post, Category } from '@/app/types';
import { getCategoryBySlug } from './categories';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const postsImagesDirectory = path.join(process.cwd(), 'public/images/posts');
const helperAssetPatterns = [
  'icons8-',
  'tadm-',
  'que-gafas-',
  'unas-para-vestido-negro',
  'looks-para-embarazadas',
  'outfit-azul-mujer-1',
];

function normalizeAssetName(value: string): string {
  return decodeURIComponent(String(value || ''))
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readPostImageAssets(): string[] {
  if (!fs.existsSync(postsImagesDirectory)) {
    return [];
  }

  return fs.readdirSync(postsImagesDirectory);
}

function resolveLocalPostImage(postSlug: string, src: string): string | null {
  if (!src) {
    return null;
  }

  const cleanSrc = src.trim();
  const isLegacyRemote = cleanSrc.startsWith('https://www.tuasesordemoda.com/wp-content/uploads/');
  const isProjectImage = cleanSrc.startsWith('/images/posts/');

  if (!isLegacyRemote && !isProjectImage) {
    return null;
  }

  const fileName = cleanSrc.split('/').pop();
  if (!fileName) {
    return null;
  }

  const normalizedTarget = normalizeAssetName(fileName);
  const normalizedSlug = normalizeAssetName(postSlug);
  const imageAssets = readPostImageAssets();

  const scoredMatches = imageAssets
    .map((asset) => {
      const normalizedAsset = normalizeAssetName(asset);
      const isHelperAsset = helperAssetPatterns.some((pattern) => normalizedAsset.includes(pattern));
      let score = 0;

      if (normalizedAsset === normalizedTarget) {
        score += 100;
      }

      if (normalizedAsset.endsWith(`-${normalizedTarget}`)) {
        score += 80;
      }

      if (normalizedAsset.startsWith(`${normalizedSlug}-`)) {
        score += 25;
      }

      if (normalizedAsset.includes(normalizedTarget.replace(/\.[^.]+$/, ''))) {
        score += 10;
      }

      if (isHelperAsset) {
        score -= 200;
      }

      return { asset, score };
    })
    .filter((candidate) => candidate.score >= 80)
    .sort((left, right) => right.score - left.score);

  if (scoredMatches.length === 0) {
    return null;
  }

  return `/images/posts/${scoredMatches[0].asset}`;
}

function rewriteContentImageSources(content: string, postSlug: string): string {
  return content
    .replace(/!\[([^\]]*)\]\((https:\/\/www\.tuasesordemoda\.com\/wp-content\/uploads\/[^)]+)\)/g, (match, alt, src) => {
      const localSrc = resolveLocalPostImage(postSlug, src);
      return localSrc ? `![${alt}](${localSrc})` : match;
    })
    .replace(/(<img[^>]+src=")([^"]+)(")/g, (match, prefix, src, suffix) => {
      const localSrc = resolveLocalPostImage(postSlug, src);
      return localSrc ? `${prefix}${localSrc}${suffix}` : match;
    });
}

const readPostSlugs = cache((): string[] => {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
});

const readPostBySlug = cache((slug: string): Post | null => {
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
});

const readPostContent = cache(async (slug: string): Promise<string> => {
  const post = readPostBySlug(slug);
  if (!post) return '';

  const contentWithLocalImages = rewriteContentImageSources(post.content, slug);

  const processedContent = await remark()
    .use(html, {
      sanitize: false,  // Allow raw HTML
      allowDangerousHtml: true  // Allow potentially dangerous HTML
    })
    .process(contentWithLocalImages);

  return processedContent.toString();
});

const readAllPosts = cache((): Post[] => {
  const slugs = readPostSlugs();
  return slugs
    .map((slug) => readPostBySlug(slug.replace(/\.md$/, '')))
    .filter((post): post is Post => post !== null)
    .sort((post1, post2) => (post1.publishedAt > post2.publishedAt ? -1 : 1));
});

export function getPostSlugs(): string[] {
  return readPostSlugs();
}

export function getPostBySlug(slug: string): Post | null {
  return readPostBySlug(slug);
}

export function getPostPath(slug: string): string {
  return `/${slug}`;
}

export async function getPostContent(slug: string): Promise<string> {
  return readPostContent(slug);
}

export function getAllPosts(): Post[] {
  return readAllPosts();
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return readAllPosts().filter(post =>
    post.categories.some(category => category.slug === categorySlug)
  );
}

export function getFeaturedPosts(limit: number = 6): Post[] {
  return readAllPosts()
    .filter(post => post.featured)
    .slice(0, limit);
}

export function getLatestPosts(limit: number = 5): Post[] {
  return readAllPosts()
    .filter(post => post.status === 'published')
    .slice(0, limit);
}

export function getRelatedPosts(currentPostSlug: string, currentCategorySlug: string, limit: number = 3): Post[] {
  const currentPost = readPostBySlug(currentPostSlug);
  if (!currentPost) return [];

  return readAllPosts()
    .filter(post =>
      post.slug !== currentPostSlug &&
      post.status === 'published' &&
      post.categories.some(category => category.slug === currentCategorySlug)
    )
    .slice(0, limit);
}
