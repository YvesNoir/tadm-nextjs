---
name: seo-migracion
description: Usa esta skill cuando el trabajo sea preservar y mejorar el SEO durante la migración desde WordPress. Sirve para revisar slugs, URLs, redirects 301, metadata, sitemap, robots, enlazado interno y consistencia entre URLs indexadas y rutas nuevas.
---

# SEO Migracion

Esta skill se usa para proteger tráfico e indexación durante la transición desde WordPress a Next.js.

## Objetivo

- Mantener las URLs actuales siempre que sea posible.
- Si no es posible, cubrir el cambio con redirects 301 correctos.
- Dejar metadatos y señales técnicas consistentes.

## Cuándo usarla

- Cuando se revisan slugs o rutas
- Cuando se agregan o corrigen redirects
- Cuando se valida sitemap, robots o metadata
- Cuando se compara una URL WordPress actual con una ruta nueva

## Flujo

1. Identificar la URL actual indexada o la estructura WordPress a preservar.
2. Buscar el post correspondiente en `content/posts`.
3. Confirmar cuál debe ser la URL final:
   - igual a la actual, si la arquitectura lo permite
   - o nueva URL con redirect 301 obligatorio
4. Revisar:
   - slug
   - categoría
   - `seoTitle`
   - `seoDescription`
   - canonical implícita o explícita
   - sitemap
   - robots
5. Si hay cambio de ruta, actualizar la lógica de redirects sin romper rutas existentes.

## Reglas

- Priorizar preservar URLs ya indexadas.
- Nunca cambiar un slug por motivos visuales solamente.
- Cada cambio de URL debe quedar cubierto con redirect 301 o justificado.
- No introducir canibalización entre artículos similares.
- Verificar que `hombre` y `mujer` no generen rutas duplicadas para el mismo contenido.

## Salidas esperadas

- Mapa `URL actual -> URL nueva`
- Redirects necesarios
- Auditoría técnica SEO
- Riesgos de indexación detectados

## Archivos clave

- `proxy.js`
- `config/redirects.js`
- `scripts/generate-redirects.js`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/[category]/[post]/page.tsx`
- `app/layout.tsx`

