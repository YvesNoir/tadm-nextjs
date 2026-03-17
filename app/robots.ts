import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.tuasesordemoda.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/private/',
          '/*.json$',
          '/*?*utm_*',
          '/*?*fbclid*',
          '/*?*gclid*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/images/',
          '/_next/static/',
          '/favicon.ico'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/images/',
          '/_next/static/',
          '/favicon.ico'
        ],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}