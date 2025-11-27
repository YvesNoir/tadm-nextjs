import { NextResponse } from 'next/server'
import { REDIRECTS_MAP } from './config/redirects.js'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Obtener el slug del path (sin la barra inicial)
  const slug = pathname.slice(1)

  // Verificar si es un redirect de artículo antiguo
  if (REDIRECTS_MAP[slug]) {
    const category = REDIRECTS_MAP[slug]
    const newPath = `/${category}/${slug}`

    console.log(`🔄 Redirect 301: ${pathname} -> ${newPath}`)

    // Crear URL completa con la nueva ruta
    const newUrl = new URL(newPath, request.url)

    // Redirect 301 permanente
    return NextResponse.redirect(newUrl, 301)
  }

  // Si no hay redirect, continuar normalmente
  return NextResponse.next()
}

export const config = {
  // Matcher para optimizar performance
  // Solo ejecuta en rutas que podrían ser artículos antiguos
  matcher: [
    /*
     * Excluir:
     * - api routes
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - archivos públicos (.*)
     * - rutas que ya tienen categoría (/mujer, /hombre, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*)(?![\\w-]+/[\\w-]+).*)'
  ]
}