# 🔧 Scripts de Extracción de Blog

Este directorio contiene herramientas para extraer automáticamente contenido de tu blog actual y convertirlo al formato de tu nuevo sitio.

## 📋 Scripts Disponibles

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