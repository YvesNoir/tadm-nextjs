import { NextResponse } from 'next/server'
import { REDIRECTS_MAP } from './config/redirects.js'

const RESERVED_ROOT_PATHS = new Set([
  '',
  'blog',
  'buscar',
  'mujer',
  'hombre',
  'moda',
  'belleza',
  'salud',
  'zapatos',
  'perfumes',
  'recomendaciones',
  'robots.txt',
  'sitemap.xml'
])

const LEGACY_ROOT_REDIRECTS = {
  'anatomia-de-una-limpieza-perfecta-el-ritual-paso-a-paso-para-una-piel-de-pasarela':
    'la-rutina-de-limpieza-facial-que-mas-notara-tu-rostro',
  'best-shoes-styles-for-short-women': 'tipos-de-zapatos-para-mujeres-bajitas',
  'piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer':
    'piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer-ef-bf-bc',
  'what-to-wear-to-a-baptism-simple-outfits-ideas': 'looks-bautizo',
  'womens-body-shapes-what-type-is-yours': 'tipos-de-cuerpo-de-mujer'
}

function normalizeLegacySlug(slug) {
  const decoded = (() => {
    try {
      return decodeURIComponent(slug)
    } catch {
      return slug
    }
  })()

  return decoded
    .replace(/%EF%BF%BC/gi, '-ef-bf-bc')
    .replace(/[\uFFFC\uFEFF]/g, '-ef-bf-bc')
}

export function proxy(request) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 1) {
    const requestedSlug = segments[0]
    const slug = normalizeLegacySlug(requestedSlug)

    if (RESERVED_ROOT_PATHS.has(requestedSlug)) {
      return NextResponse.next()
    }

    const redirectSlug = LEGACY_ROOT_REDIRECTS[slug]
    if (redirectSlug) {
      const canonicalUrl = request.nextUrl.clone()
      canonicalUrl.pathname = `/${redirectSlug}`
      return NextResponse.redirect(canonicalUrl, 301)
    }

    const category = REDIRECTS_MAP[slug]
    if (category) {
      const rewriteUrl = request.nextUrl.clone()
      rewriteUrl.pathname = `/${category}/${slug}`
      return NextResponse.rewrite(rewriteUrl)
    }
  }

  if (segments.length === 2) {
    const [category, requestedSlug] = segments
    const slug = normalizeLegacySlug(requestedSlug)
    const redirectSlug = LEGACY_ROOT_REDIRECTS[slug]

    if (redirectSlug) {
      const canonicalUrl = request.nextUrl.clone()
      canonicalUrl.pathname = `/${redirectSlug}`
      return NextResponse.redirect(canonicalUrl, 301)
    }

    const expectedCategory = REDIRECTS_MAP[slug]

    if (expectedCategory && expectedCategory === category) {
      const canonicalUrl = request.nextUrl.clone()
      canonicalUrl.pathname = `/${requestedSlug}`
      return NextResponse.redirect(canonicalUrl, 301)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
}
