---
name: redactor-seo
description: Usa esta skill cuando el trabajo sea crear un artículo nuevo a partir de una URL de referencia, manteniendo solo el tópico e intención de búsqueda, pero reescribiendo desde cero con enfoque SEO, tono humano-profesional y formato listo para content/posts.
---

# Redactor SEO

Esta skill se usa para crear artículos nuevos para "Tu Asesor de Moda" a partir de una URL o artículo de referencia.

## Objetivo

- Crear un artículo nuevo, original y mejorado.
- Mantener el tópico y la intención de búsqueda, no la redacción original.
- Detectar keywords y longtails útiles para posicionar.
- Escribir con tono cercano, humano y con criterio profesional.
- Dejar la salida lista para `content/posts`.

## Cuándo usarla

- Cuando el usuario pasa una URL y quiere un artículo nuevo sobre el mismo tema.
- Cuando hay que competir con una pieza existente sin copiarla.
- Cuando se necesita un borrador completo con SEO, estructura y assets sugeridos.

## Flujo

1. Leer la URL o el artículo de referencia.
2. Identificar:
   - tema principal
   - intención de búsqueda
   - headings
   - posible keyword principal
   - longtails y preguntas derivadas
   - si hay galerías o imágenes relevantes
3. Revisar rápidamente `content/posts` para evitar canibalización evidente o duplicados muy cercanos.
4. Definir:
   - keyword principal
   - 5 a 12 keywords secundarias/longtail
   - categoría principal
   - categoría secundaria opcional si realmente aporta
5. Crear un artículo nuevo:
   - original
   - evergreen
   - sin años innecesarios
   - sin frases literales de la fuente
6. Guardar el artículo en `content/posts` con frontmatter completo y `status: draft`.
7. Si faltan imágenes reales, usar `scripts/generate-post-images.js` o dejar prompts de imagen reutilizables.

## Reglas

- No copiar frases literales de la URL fuente.
- No repetir la estructura exacta salvo que sea la mejor forma de cubrir la intención de búsqueda.
- No escribir como IA ni usar relleno.
- No inventar datos arbitrarios: si se infiere una tendencia, debe sonar razonable y consistente con moda real.
- Evitar años en títulos, excerpts, `seoTitle`, `seoDescription` y headings, salvo que sean parte de un dato histórico real.
- Priorizar artículos evergreen.
- El tono debe sonar humano, cercano y con conocimiento.
- La categoría debe ser coherente con el árbol actual.
- Si ninguna categoría actual encaja bien, se puede proponer una nueva categoría, pero hay que explicitarlo y actualizar `app/lib/categories.ts` si el usuario quiere incorporarla al sitio.
- Por defecto, crear el artículo con `status: draft` para que no indexe hasta revisión.

## Formato de salida

Crear un `.md` en `content/posts` con frontmatter completo:

- `title`
- `excerpt`
- `date`
- `author`
- `categories`
- `tags`
- `featured`
- `seoTitle`
- `seoDescription`
- `originalUrl`
- `coverImage` si existe o si se definió asset
- `status: draft`

Después del frontmatter:

- introducción clara
- desarrollo con `##` y `###`
- cierre útil
- si aplica, bloque de galería o especificación de imágenes

## Imágenes

- Si existe una imagen real adecuada en la referencia y es reutilizable dentro del flujo del proyecto, dejar indicada la necesidad de asset.
- Si no hay imagen utilizable, usar `scripts/generate-post-images.js` con criterio.
- Prioridad:
  - `1` portada
  - `0-4` imágenes de galería si el artículo realmente lo necesita
  - más de eso solo si el contenido lo justifica
- Límite duro inicial: no superar `12` imágenes por artículo sin pedido explícito del usuario.
- Si la API no está disponible, dejar prompts listos en el propio artículo o en una nota breve junto al archivo.

## Taxonomía

- Preferir categorías existentes en `app/lib/categories.ts`.
- No crear categorías nuevas por capricho.
- Solo crear una categoría nueva si mejora claramente la organización y la futura indexación.
- Si se crea una categoría nueva, actualizar:
  - `app/lib/categories.ts`
  - frontmatter del post
  - y dejar SEO básico de esa categoría

## Validación mínima antes de cerrar

- El artículo responde a una intención de búsqueda clara.
- No suena derivativo ni genérico.
- El slug propuesto es limpio y atemporal.
- La categoría es consistente.
- El artículo queda en `draft`.
- Las keywords aparecen de forma natural, sin sobreoptimización.

## Archivos clave

- `content/posts`
- `app/lib/categories.ts`
- `app/lib/posts.ts`
- `scripts/generate-post-images.js`
- `docs/content-compare-full-2026-03-16.md`
