---
name: wordpress-migracion
description: Usa esta skill cuando el trabajo sea migrar, auditar o corregir artículos traídos desde WordPress a este proyecto Next.js. Sirve para revisar posts Markdown, frontmatter, categorías, slugs, imágenes, galerías, duplicados y diferencias entre WordPress y content/posts.
---

# WordPress Migracion

Esta skill se usa para cerrar la migración editorial y técnica desde WordPress hacia `content/posts`.

## Objetivo

- Completar la migración de artículos sin perder contenido.
- Detectar artículos faltantes, duplicados o mal clasificados.
- Mantener consistencia entre WordPress y la nueva web.

## Contexto del proyecto

- Sitio: "Tu Asesor de Moda"
- Stack: Next.js App Router, TypeScript, Tailwind CSS
- Fuente de títulos: Abril Fatface
- Categorías sensibles: `hombre` y `mujer`
- Las galerías deben mantener 3 columnas fijas cuando el diseño lo permita

## Cuándo usarla

- Cuando se extraen nuevos artículos desde WordPress
- Cuando hay que revisar un lote de posts ya migrados
- Cuando hay dudas sobre categorías, slugs, excerpts o assets
- Cuando hay que comparar contenido entre WordPress y Markdown

## Flujo

1. Localizar el artículo o lote en `content/posts`.
2. Revisar frontmatter: `title`, `excerpt`, `date`, `categories`, `tags`, `coverImage`, `seoTitle`, `seoDescription`, `status`.
3. Validar que la categoría principal sea correcta y que no exista mezcla indebida entre `hombre` y `mujer`.
4. Revisar el cuerpo del artículo:
   - encabezados
   - párrafos vacíos o repetidos
   - HTML heredado innecesario
   - galerías e imágenes
5. Validar que los assets existan en `public/images/posts`.
6. Si el artículo proviene de una URL WordPress concreta, dejar asentado el slug final esperado.

## Reglas

- No inventar categorías nuevas si ya existe una válida en `app/lib/categories.ts`.
- No dejar posts duplicados entre `hombre` y `mujer`.
- No cambiar slugs sin considerar impacto SEO.
- Si un artículo está incompleto, reportarlo explícitamente.
- Mantener el estilo editorial del sitio, no reescribir por completo sin motivo.

## Salidas esperadas

- Posts corregidos
- Lista de faltantes
- Lista de inconsistencias por resolver
- Recomendación clara de slug y categoría final

## Archivos clave

- `content/posts`
- `public/images/posts`
- `scripts/blog-extractor.js`
- `app/lib/posts.ts`
- `app/lib/categories.ts`

