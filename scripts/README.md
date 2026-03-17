# 🔧 Scripts de Extracción de Blog

Este directorio contiene herramientas para extraer automáticamente contenido de tu blog actual y convertirlo al formato de tu nuevo sitio.

## 📋 Scripts Disponibles

### 0. `generate-post-images.js` - Generador de imágenes con Gemini
Genera imágenes editoriales para portada o galería y las guarda en `public/images/posts/`.

#### Variables requeridas:
```bash
GEMINI_API_KEY=tu_api_key_nueva
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image-preview
```

#### Uso para portada:
```bash
node scripts/generate-post-images.js --slug outfit-primavera-mujer --mode cover --count 1
```

#### Uso para galería:
```bash
node scripts/generate-post-images.js --slug outfit-primavera-mujer --mode gallery --count 4
```

#### Uso solo para ver prompts:
```bash
node scripts/generate-post-images.js --slug outfit-primavera-mujer --mode gallery --count 4 --dry-run
```

#### Qué hace:
- ✅ Lee contexto del post si ya existe en `content/posts`
- ✅ Genera prompts editoriales pensados para moda
- ✅ Usa Gemini por API
- ✅ Guarda imágenes localmente en `public/images/posts`
- ✅ Convierte siempre el resultado final a `webp`
- ✅ Aplica marca de agua centrada con el logo blanco del sitio
- ✅ Limita automáticamente el tamaño de salida según uso
- ✅ Limita la generación a un máximo de 12 imágenes por corrida
- ✅ Sirve para portada o galería

#### Optimización automática:
- `cover`: máximo `1400px` de ancho
- `gallery`: máximo `900px` de ancho
- formato final: `.webp`
- calidad objetivo: `78`
- naming final:
  - portada: `slug-cover.webp`
  - galería: `slug-gallery-1.webp`, `slug-gallery-2.webp`, etc.

#### Notas:
- La marca de agua se toma desde `public/images/tuasesordemoda-logo-white.png`
- Aunque Gemini devuelva `png` o `jpg`, el archivo publicado queda optimizado en `webp`
- El `--dry-run` sirve para validar prompts, nombres de archivo y tamaño objetivo sin consumir imágenes
- El archivo original que devuelve Gemini se guarda localmente en `image-sources/ai-generated/`
- Esa carpeta queda ignorada por git para que no se suba a Vercel ni al repo

### 0.1. `optimize-post-images.js` - Reoptimiza imágenes ya generadas
Toma las imágenes existentes de un post, les aplica resize, watermark y conversión a `webp` sin volver a llamar a la API.

#### Uso:
```bash
node scripts/optimize-post-images.js --slug pantalones-capri-como-combinarlos
```

#### Qué hace:
- ✅ Busca portada y galerías del slug dentro del markdown del post
- ✅ Convierte `.png`, `.jpg` o `.jpeg` a `.webp`
- ✅ Aplica la misma marca de agua centrada con el logo blanco
- ✅ Limita `cover` a `1400px` y `gallery` a `900px`
- ✅ Reescribe el post para apuntar a los archivos optimizados

### 1. `blog-extractor.js` - Extractor Individual
Extrae un artículo individual de una URL específica.

#### Uso:
```bash
node scripts/blog-extractor.js <URL>
```

#### Ejemplo:
```bash
node scripts/blog-extractor.js https://www.tuasesordemoda.com/cara-diamante-hombre/
```

#### Qué hace:
- ✅ Extrae título, contenido y metadatos
- ✅ Descarga todas las imágenes automáticamente
- ✅ Convierte HTML a Markdown
- ✅ Detecta categorías automáticamente
- ✅ Genera tags relevantes
- ✅ Crea archivo `.md` listo para usar
- ✅ Optimiza SEO metadata

### 2. `bulk-extractor.js` - Extractor Masivo
Extrae múltiples artículos de una lista de URLs.

#### Uso con URLs directas:
```bash
node scripts/bulk-extractor.js <url1> <url2> <url3>...
```

#### Uso con archivo de URLs:
```bash
node scripts/bulk-extractor.js --file urls.txt
```

#### Con delay personalizado:
```bash
node scripts/bulk-extractor.js --file urls.txt --delay 3000
```

#### Ejemplo de archivo `urls.txt`:
```
https://www.tuasesordemoda.com/cara-diamante-hombre/
https://www.tuasesordemoda.com/combinar-zapatos-marrones/
https://www.tuasesordemoda.com/peinados-cara-redonda/
```

## 📁 Estructura de Salida

### Archivos Markdown
Los artículos se guardan en: `content/posts/`

#### Formato del archivo:
```markdown
---
title: "Título del artículo"
excerpt: "Descripción breve..."
date: "2023-06-11"
author: "TuAsesorDeModa"
categories: ["hombre", "moda"]
tags: ["estilo", "consejos", "tendencias"]
featured: true
seoTitle: "Título SEO"
seoDescription: "Descripción SEO"
originalUrl: "https://..."
---

# Contenido del artículo en Markdown
...
```

### Imágenes
Las imágenes se descargan en: `public/images/posts/`

- Formato: `image-1.jpg`, `image-2.png`, etc.
- Se mantiene calidad original
- Se renombran para evitar conflictos

## 🎯 Funcionalidades Avanzadas

### Detección Automática de Categorías
El script detecta automáticamente las categorías basado en el contenido:

- **Hombre**: palabras como "hombre", "masculino", "caballero"
- **Mujer**: palabras como "mujer", "femenino", "dama"
- **Belleza**: palabras como "belleza", "maquillaje", "skincare"
- **Zapatos**: palabras como "zapatos", "calzado", "botas"
- **Perfumes**: palabras como "perfume", "fragancia", "colonia"
- **Salud**: palabras como "salud", "bienestar", "ejercicio"

### Generación de Tags
Extrae automáticamente tags relevantes del contenido y metadatos.

### Optimización SEO
- Mantiene títulos SEO originales
- Preserva descripciones meta
- Genera URLs amigables (slugs)

## 🚀 Cómo Usar para Migrar Todo tu Blog

### Paso 1: Obtener todas las URLs
Puedes obtener todas las URLs de tu sitemap:
```bash
curl https://www.tuasesordemoda.com/sitemap.xml | grep -oP 'https://www\.tuasesordemoda\.com/[^<]+' > urls.txt
```

### Paso 2: Limpiar la lista (opcional)
Edita `urls.txt` para remover URLs que no quieras migrar (páginas de categorías, etc.)

### Paso 3: Ejecutar extracción masiva
```bash
node scripts/bulk-extractor.js --file urls.txt --delay 3000
```

### Paso 4: Revisar resultados
- Los archivos `.md` estarán en `content/posts/`
- Las imágenes en `public/images/posts/`
- Un reporte detallado en `scripts/extraction-report-*.json`

## ⚙️ Configuración

### Delay entre requests
Para evitar sobrecargar tu servidor, el script incluye un delay entre requests:
- Por defecto: 2000ms (2 segundos)
- Personalizable: `--delay <milisegundos>`

### Filtros de contenido
El extractor intenta identificar automáticamente el contenido principal y excluye:
- Scripts y estilos
- Navegación y sidebars
- Publicidad
- Elementos de compartir social

## 🐛 Solución de Problemas

### Error: ENOTFOUND
- Verifica que tengas conexión a internet
- Confirma que la URL es accesible

### Imágenes no se descargan
- Revisa que las URLs de imágenes sean accesibles
- Algunas imágenes pueden estar protegidas

### Contenido incompleto
- El script trata de detectar automáticamente el contenido principal
- Si falla, puedes editar manualmente el `.md` resultante

## 📊 Reporte de Extracción

Cada ejecución masiva genera un reporte JSON con:
- Estadísticas generales
- Lista de artículos procesados
- Errores encontrados
- Imágenes descargadas

## 💡 Tips

1. **Ejecuta en horarios de poco tráfico** para no afectar tu sitio actual
2. **Usa delays largos** (3-5 segundos) si tienes muchos artículos
3. **Revisa manualmente** algunos artículos extraídos antes de migrar todo
4. **Haz backup** de tu contenido actual antes de comenzar

## 🔄 Próximas Mejoras

- [ ] Soporte para sitios con autenticación
- [ ] Mejores filtros de contenido
- [ ] Extracción de comentarios
- [ ] Soporte para diferentes CMSs
- [ ] Interfaz web para el extractor
