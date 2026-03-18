---
name: auditor-seo
description: Usa esta skill cuando el trabajo sea auditar el blog desde una mirada SEO integral. Sirve para detectar fallas técnicas, oportunidades de indexación, mejoras por keywords, interlinking interno, canibalización y optimizaciones para buscadores tradicionales y respuestas de IA.
---

# Auditor SEO

Esta skill se usa para revisar "Tu Asesor de Moda" con foco en crecimiento orgánico, calidad técnica e identificación de oportunidades concretas.

## Objetivo

- Detectar problemas SEO técnicos y editoriales.
- Priorizar mejoras con impacto real sobre tráfico e indexación.
- Encontrar oportunidades de keywords, enlazado interno y cobertura temática.
- Mejorar la preparación del sitio para Google, Discover, AI Overviews y sistemas de respuesta generativa.

## Cuándo usarla

- Cuando se quiera hacer una auditoría SEO completa del blog.
- Cuando haya que revisar por qué ciertas URLs no rinden.
- Cuando se quiera mejorar CTR, impresiones, indexación o interlinking.
- Cuando haya que decidir qué artículos optimizar primero.
- Cuando se quiera preparar el sitio para mayor visibilidad en buscadores y asistentes de IA.

## Capacidades principales

### 1. Search Console

Si hay acceso a Search Console o a su API, esta skill puede:

- revisar queries por URL
- detectar impresiones altas con CTR bajo
- identificar URLs con potencial no aprovechado
- revisar indexación, cobertura y sitemaps
- detectar URLs que ya rankean para longtails valiosas

### 2. Interlinking

Puede analizar todos los posts y proponer:

- enlaces internos contextuales
- artículos huérfanos o casi huérfanos
- clusters temáticos débiles
- enlaces que faltan entre piezas claramente relacionadas

### 3. Keywords y contenido

Puede cruzar contenido actual con rendimiento orgánico para:

- detectar keywords secundarias no cubiertas
- proponer nuevos `h2`, `h3`, bloques FAQ o respuestas breves
- encontrar artículos con canibalización
- sugerir nuevos artículos para cubrir huecos temáticos

### 4. Visibilidad para IA

Puede evaluar si el contenido está bien preparado para:

- ser resumido por Google
- aparecer en AI Overviews
- ser citado por asistentes o buscadores generativos

No existe una garantía de aparición, pero sí señales que aumentan la probabilidad:

- respuestas claras y tempranas
- estructura semántica fuerte
- definiciones concretas
- bloques comparativos útiles
- FAQs bien formuladas
- buena entidad de sitio y consistencia editorial

## Fuentes de verdad

Prioridad de uso:

1. código y contenido del repo
2. Search Console / API oficial si está disponible
3. sitemap, robots, metadata y HTML generado
4. datos de analytics si el usuario los aporta

## Flujo recomendado

1. Definir el tipo de auditoría:
   - técnica
   - keywords
   - interlinking
   - Search Console
   - AI visibility
2. Reunir contexto mínimo:
   - `content/posts`
   - `app/sitemap.ts`
   - `app/robots.ts`
   - metadata de layout, categorías y posts
3. Detectar hallazgos ordenados por impacto:
   - bloqueantes
   - quick wins
   - mejoras estructurales
4. Proponer acciones concretas, no teoría.
5. Si corresponde, editar o dejar un reporte persistido en `docs/`.

## Reglas

- No sugerir cambios masivos de slug sin una razón fuerte.
- No proponer interlinking forzado o irrelevante.
- No recomendar keywords que rompan la intención de búsqueda del artículo.
- No introducir cambios SEO que degraden legibilidad o tono editorial.
- Si se usa Search Console, distinguir siempre entre:
  - datos observados
  - inferencias
  - acciones recomendadas

## Tipos de salida esperados

### Auditoría técnica

- páginas sin metadata suficiente
- problemas de canonical
- problemas de `og:image`
- gaps en sitemap / robots
- errores de indexación o discoverability

### Auditoría de contenido

- artículos con titles o descriptions débiles
- posts con intención mal cubierta
- piezas demasiado similares entre sí
- artículos sin respuesta clara al inicio

### Auditoría de interlinking

- artículos huérfanos
- posts que deberían enlazarse entre sí
- clusters temáticos incompletos
- anchors sugeridos

### Auditoría de visibilidad para IA

- páginas con demasiado relleno antes de responder
- artículos sin definiciones claras
- headings poco útiles para extracción semántica
- falta de bloques tipo "qué es", "cómo", "cuándo", "para quién"

## Integración futura con Search Console

Si el usuario quiere conectar Search Console, esta skill debe pedir o usar:

- propiedad verificada
- OAuth o service account con acceso a la propiedad
- consultas principales:
  - rendimiento por página
  - rendimiento por query
  - inspección de URL
  - estado de sitemap

## Salidas recomendadas

- reporte en `docs/seo-audit-YYYY-MM-DD.md`
- lista priorizada de quick wins
- propuesta de interlinking por lote
- sugerencias concretas por artículo

## Archivos clave

- `content/posts`
- `app/layout.tsx`
- `app/[category]/page.tsx`
- `app/[category]/[post]/page.tsx`
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/lib/posts.ts`
- `app/lib/seo.ts`
- `config/redirects.js`
