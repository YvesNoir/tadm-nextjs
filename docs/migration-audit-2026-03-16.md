# Auditoria de migracion WordPress -> Next

Fecha: 2026-03-16

## Fuente auditada

- Sitio activo: `https://www.tuasesordemoda.com/`
- `robots.txt` expone: `https://www.tuasesordemoda.com/sitemap_index.xml`
- Sitemap de posts auditado: `https://www.tuasesordemoda.com/post-sitemap.xml`

## Conteo inicial

- Posts en WordPress sitemap: `79`
- Posts locales en `content/posts`: `74`

## Hallazgos principales

### 1. Faltan articulos o variantes de URL en Next

Slugs presentes en WordPress y ausentes localmente:

- `anatomia-de-una-limpieza-perfecta-el-ritual-paso-a-paso-para-una-piel-de-pasarela`
- `best-shoes-styles-for-short-women`
- `las-mejores-zapatillas-de-padel-para-mujer`
- `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`
- `what-to-wear-to-a-baptism-simple-outfits-ideas`
- `womens-body-shapes-what-type-is-yours`

### 2. Hay un slug local con basura de codificacion

- Local: `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer-ef-bf-bc`
- WordPress: `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`

Esto parece ser el mismo articulo con un problema de codificacion del slug.

### 3. Variantes en ingles probablemente no migradas como aliases

Estos slugs de WordPress parecen corresponder a contenido ya existente en espanol:

- `best-shoes-styles-for-short-women`
  Posible equivalente: `tipos-de-zapatos-para-mujeres-bajitas`
- `what-to-wear-to-a-baptism-simple-outfits-ideas`
  Posible equivalente: `looks-bautizo`
- `womens-body-shapes-what-type-is-yours`
  Posible equivalente: `tipos-de-cuerpo-de-mujer`

Estas URLs siguen vivas en WordPress y, si hoy indexan, deben preservarse con contenido equivalente o redirect 301 explicito.

### 4. La arquitectura actual de Next no preserva las URLs historicas

WordPress publica articulos en raiz:

- `https://www.tuasesordemoda.com/slug/`

El proyecto Next actual sirve articulos por categoria:

- `/{category}/{slug}`

Si el objetivo es mantener exactamente las mismas URLs que la web anterior, la arquitectura actual no alcanza. Haran falta rutas raiz para articulos o redirects que respeten la URL final deseada.

## Faltantes que parecen reales

Estos dos se ven como articulos realmente no migrados:

- `anatomia-de-una-limpieza-perfecta-el-ritual-paso-a-paso-para-una-piel-de-pasarela`
- `las-mejores-zapatillas-de-padel-para-mujer`

## Prioridad de trabajo

1. Corregir slug sucio de `piel-seca-en-invierno-esto-es-lo-que-hay-que-hacer`
2. Confirmar y migrar los faltantes reales
3. Decidir estrategia para URLs raiz historicas
4. Revisar si las URLs alternativas en ingles deben existir como paginas o solo como redirects 301
5. Comparar contenido literal de cada articulo comun entre WordPress y Markdown

