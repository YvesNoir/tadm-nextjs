# Recuperación SEO post migración - 2026-04-15

## Objetivo

Recuperar URLs históricas que seguían apareciendo en Search Console o en auditorías previas, pero que no estaban cubiertas correctamente por la migración a Next.js.

## URLs recuperadas con redirect 301

Se agregaron aliases en [proxy.js](/Users/sebastianfente/Documents/Development/tadm-nextjs/proxy.js) para redirigir estas URLs históricas a su equivalente actual:

- `/best-shoes-styles-for-short-women` -> `/tipos-de-zapatos-para-mujeres-bajitas`
- `/what-to-wear-to-a-baptism-simple-outfits-ideas` -> `/looks-bautizo`
- `/womens-body-shapes-what-type-is-yours` -> `/tipos-de-cuerpo-de-mujer`
- `/piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer` -> `/piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer-ef-bf-bc`
- `/anatomia-de-una-limpieza-perfecta-el-ritual-paso-a-paso-para-una-piel-de-pasarela` -> `/la-rutina-de-limpieza-facial-que-mas-notara-tu-rostro`

## Validación local

Se validó con `npm run dev` y `curl -I -L` que las URLs anteriores ahora:

- normalizan primero la variante con slash final
- responden `301` a la URL canónica nueva
- terminan en `200`

## Pendiente prioritario

La URL histórica:

- `/las-mejores-zapatillas-de-padel-para-mujer`

sigue en `404`.

No se redirigió de forma automática porque hoy no existe en el proyecto un artículo equivalente claro y redirigirla a una categoría genérica degradaría la señal SEO.

## Siguiente paso recomendado

Crear o migrar un artículo específico para `las-mejores-zapatillas-de-padel-para-mujer` y, recién entonces, agregar el `301` hacia esa nueva URL o publicar el contenido con ese mismo slug si se quiere conservar al máximo la URL histórica.
