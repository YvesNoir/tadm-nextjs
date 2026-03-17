# Checklist de Pre-Lanzamiento

## Estado actual

- La migración de contenido ya quedó razonablemente confiable.
- Las URLs raíz de artículos fueron alineadas con WordPress.
- `sitemap` y `robots` existen en la app.
- Los artículos fueron limpiados en gran parte para evitar referencias temporales innecesarias.

## SEO técnico

- [ ] Confirmar que `https://dominio/sitemap.xml` responda `200` en producción.
- [ ] Confirmar que `https://dominio/robots.txt` responda `200` en producción.
- [x] Verificar que el `sitemap` incluya home, categorías y artículos publicados.
- [x] Verificar que `robots.txt` no bloquee páginas importantes por error.
- [x] Confirmar que cada artículo tenga canonical correcta a su URL raíz.
- [x] Revisar que no queden rutas internas con categoría indexándose como duplicadas frente a la URL raíz.
- [ ] Revisar que los `title` y `description` de páginas clave no tengan placeholders ni texto roto.
- [ ] Reemplazar códigos de verificación placeholder en [app/layout.tsx](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/layout.tsx) si se van a usar Search Console/Bing/Yandex.

Notas de auditoría:
- [app/sitemap.ts](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/sitemap.ts) ya incluye home, páginas estáticas, categorías y los `74` artículos mapeados desde [config/redirects.js](/Users/sebastianfente/Documents/Development/tadm-nextjs/config/redirects.js).
- [app/robots.ts](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/robots.ts) permite indexación general y solo bloquea rutas técnicas/privadas (`/api/`, `/_next/`, `/admin/`, `/private/` y parámetros de tracking).
- [app/[category]/[post]/page.tsx](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/[category]/[post]/page.tsx) ya publica canonical a `/{slug}`.
- [proxy.js](/Users/sebastianfente/Documents/Development/tadm-nextjs/proxy.js) ya reescribe `/{slug}` al artículo real y redirige `/{category}/{slug}` hacia la raíz con `301`.
- [app/layout.tsx](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/layout.tsx) ya no publica placeholders; ahora toma verificaciones opcionales desde `GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION` y `YAHOO_SITE_VERIFICATION`.

## URLs y redirecciones

- [ ] Probar manualmente una muestra de URLs históricas importantes del WordPress anterior.
- [x] Verificar que `/slug` cargue bien para artículos existentes.
- [x] Verificar que `/{category}/{slug}` redirija a `/{slug}` cuando corresponda.
- [ ] Detectar si queda alguna URL histórica importante sin equivalencia en Next.
- [ ] Revisar si los artículos excluidos de la migración necesitan redirect específico, `410` o mantenerse fuera.

Notas de auditoría:
- La auditoría previa dejó las URLs raíz de artículos alineadas con WordPress.
- Se validó que los artículos existentes cargan por `/{slug}` y que la versión con categoría redirige a la canónica.
- Sigue pendiente la decisión operativa sobre los artículos excluidos de la migración.

## Indexación

- [ ] Dar de alta la propiedad en Google Search Console.
- [ ] Verificar propiedad por método definitivo.
- [ ] Enviar `sitemap.xml` en Search Console.
- [ ] Revisar cobertura/indexación después del envío.
- [ ] Comprobar si Google detecta duplicados por canonicals o redirecciones.

## Contenido

- [ ] Revisar manualmente artículos sensibles o estratégicos antes de publicar.
- [x] Confirmar que no queden años innecesarios en títulos, excerpts, `seoTitle` o `seoDescription`.
- [x] Validar que los casos donde sí hay años sean históricos/reales y no resten vigencia al artículo.
- [ ] Revisar consistencia visual de galerías e imágenes dentro de los artículos más importantes.

Notas de auditoría:
- Ya se limpió la mayoría de referencias tipo `2024` y `2025` en contenido visible y campos SEO.
- El único remanente intencional detectado es [content/posts/mipelazo-com.md](/Users/sebastianfente/Documents/Development/tadm-nextjs/content/posts/mipelazo-com.md), donde `2023` aparece como dato histórico real de premios.

## Frontend y UX

- [ ] Revisar home en desktop y mobile.
- [ ] Revisar página de artículo en desktop y mobile.
- [ ] Revisar categorías y `/blog`.
- [ ] Confirmar que header y footer se comporten bien en todas las plantillas.
- [ ] Validar tipografías cargadas correctamente en producción.

## Performance

- [ ] Ejecutar build final de producción sin errores.
- [ ] Revisar tamaño y compresión de imágenes críticas.
- [ ] Confirmar que las fuentes locales carguen bien en producción.
- [ ] Verificar que no haya requests innecesarios a Google Fonts.

## Operativo

- [ ] Definir fecha/hora de salida.
- [ ] Tener backup/export de WordPress por cualquier rollback editorial.
- [ ] Confirmar acceso a hosting, DNS y Search Console antes del cambio.
- [ ] Preparar monitoreo post-lanzamiento de errores, cobertura e indexación.

## Pendientes conocidos

- En [app/layout.tsx](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/layout.tsx) siguen placeholders de verificación.
- Existe advertencia no bloqueante de `baseline-browser-mapping` al correr lint.
- Conviene una última pasada manual sobre páginas de artículo y rutas SEO críticas.

## Próximo foco recomendado

1. Resolver `verification` en [app/layout.tsx](/Users/sebastianfente/Documents/Development/tadm-nextjs/app/layout.tsx) cuando tengas los códigos reales de Search Console/Bing.
2. Hacer prueba manual en producción de `robots.txt`, `sitemap.xml` y una muestra de URLs históricas.
3. Revisar visualmente artículos estratégicos con galerías antes del lanzamiento.
