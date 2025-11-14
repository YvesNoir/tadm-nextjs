export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  categories: Category[];
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface SearchResult {
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  children?: NavigationItem[];
}

export type Season = 'verano' | 'otoño' | 'invierno' | 'primavera';
export type Gender = 'hombre' | 'mujer' | 'unisex';