import { MetadataRoute } from 'next'
import { getAllPosts } from './lib/posts'
import { getAllCategories } from './lib/categories'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tuasesordemoda.com'

  // Páginas estáticas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/mujer`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hombre`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/belleza`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }
  ]

  // Obtener todas las categorías
  const categories = getAllCategories()
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Obtener todos los posts
  const posts = getAllPosts()
  const postPages = posts.map(post => {
    const categorySlug = post.categories?.[0]?.slug || 'mujer'
    return {
      url: `${baseUrl}/${categorySlug}/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt,
      changeFrequency: 'weekly' as const,
      priority: post.featured ? 0.8 : 0.6,
    }
  })

  return [...staticPages, ...categoryPages, ...postPages]
}