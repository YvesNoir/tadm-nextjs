# Evaluación de `geo-seo-claude`

Fecha: 2026-06-22
Repo evaluado: `zubair-trabzada/geo-seo-claude`
Branch de trabajo: `geo-seo-claude`

## Conclusión rápida

El repo es útil como fuente de heurísticas GEO/SEO y como paquete de utilidades Python, pero no conviene integrarlo completo en este proyecto.

Motivos principales:

- el flujo completo depende del runtime y slash commands de Claude Code
- no es una librería desacoplada lista para importar en Next.js
- varias partes son reportes/orquestación para consultoría, no para producto

Sí vale la pena reutilizar ideas puntuales:

- validación y generación de `llms.txt`
- chequeos de `robots.txt` para crawlers de IA
- lectura técnica de HTML, metadata, headings y SSR
- scoring heurístico de citabilidad como señal secundaria, no como verdad absoluta

## Qué se probó

Se clonó el repo en `/tmp/geo-seo-claude`, se creó un virtualenv aislado y se ejecutaron sus scripts principales contra producción.

Scripts probados:

- `fetch_page.py https://www.tuasesordemoda.com full`
- `citability_scorer.py https://www.tuasesordemoda.com/tipos-de-cuerpo-de-mujer`
- `llmstxt_generator.py https://www.tuasesordemoda.com validate`
- `llmstxt_generator.py https://www.tuasesordemoda.com generate`

## Hallazgos observados en `tuasesordemoda.com`

### Señales que dieron bien

- home accesible con `200`
- SSR detectado correctamente
- canonical presente en home
- metadata principal presente
- `robots.txt` expone `sitemap.xml`
- los principales crawlers de IA quedan permitidos por default

### Gaps detectados

- no existe `https://www.tuasesordemoda.com/llms.txt`
- no existe `https://www.tuasesordemoda.com/llms-full.txt`
- home sin `structured_data` detectable en el HTML analizado

### Señal editorial del scorer

En `https://www.tuasesordemoda.com/tipos-de-cuerpo-de-mujer`, el script devolvió:

- `average_citability_score: 24.7`
- `19` bloques analizados
- `0` bloques en rango óptimo del criterio interno del repo

Interpretación:

- sirve para detectar bloques que responden tarde o quedan demasiado cortados
- es una heurística muy dura para contenido editorial de moda
- no debe usarse como score absoluto de calidad SEO

## Decisión tomada en este branch

Se implementó una primera adaptación útil del experimento:

- `app/llms.txt/route.ts`
- `app/llms-full.txt/route.ts`
- `app/lib/llms.ts`
- schema global `Organization` + `WebSite` con `SearchAction` en `app/layout.tsx`

Esto genera `llms.txt` y `llms-full.txt` en base al contenido real del sitio, con:

- páginas principales
- categorías relevantes
- artículos publicados recientes
- descripciones editoriales legibles para sistemas de recuperación

## Recomendación

No importar el repo completo dentro de `tadm-nextjs`.

Sí reutilizar por partes:

1. `llms.txt` y `llms-full.txt`
2. validaciones técnicas sobre HTML y schema
3. reporte manual para GEO cuando queramos auditar una URL puntual

Siguiente mejora razonable si seguimos esta línea:

- agregar `WebSite` + `Organization` JSON-LD en home/layout
- revisar schema de artículos
- usar el scorer de citabilidad solo para detectar secciones débiles en posts con muchas impresiones
