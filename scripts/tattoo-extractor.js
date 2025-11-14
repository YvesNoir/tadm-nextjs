const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

class TattooExtractor {
  constructor() {
    this.imageReplacements = [];
    this.imagesToDownload = [];
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      bulletListMarker: '-',
      codeBlockStyle: 'fenced'
    });

    // Configure Turndown to preserve gallery HTML
    this.turndownService.addRule('preserveGalleries', {
      filter: function (node) {
        return node.nodeName === 'DIV' &&
               (node.className.includes('image-gallery') ||
                node.className.includes('gallery-grid'));
      },
      replacement: function (content, node) {
        return node.outerHTML;
      }
    });
  }

  async extractArticle(url) {
    console.log(`🔍 Extrayendo contenido de: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });

      const $ = cheerio.load(response.data);
      const postContent = $('[data-elementor-type="wp-post"]').first();

      if (postContent.length === 0) {
        console.log('❌ No se encontró contenido de post Elementor');
        return;
      }

      console.log('🎯 Elementor post content found - applying targeted cleaning');

      // Clean the content
      const cleanedElement = postContent.clone();

      // Remove unwanted elements but preserve galleries
      cleanedElement.find(`
        nav, header, footer, .navigation,
        .skip-link, .screen-reader-text,
        .menu, .nav-menu, .language-switcher, .lang-switcher,
        [class*="flag"], .site-logo, .logo, [class*="logo"],
        .related-posts, .recommended-posts
      `).remove();

      // Extract special Elementor gallery containers FIRST
      this.extractElementorGalleryContainers(cleanedElement, $);

      // Remove TOC and related sections
      this.removeRelatedSections(cleanedElement, $);

      // Extract regular Elementor images
      this.extractElementorImages(cleanedElement, $);

      // Remove logo links and images
      this.removeLogoImages(cleanedElement, $);

      // Convert to markdown
      let markdown = this.turndownService.turndown(cleanedElement.html());

      // Process images
      markdown = this.processImagePlaceholders(markdown);

      // Get metadata
      const metadata = this.extractMetadata($, url);

      // Get the slug
      const slug = this.generateSlug(metadata.title);

      // Get featured image with slug
      const featuredImage = this.getFeaturedImage($, slug);

      // Replace {{SLUG}} placeholder with actual slug
      markdown = markdown.replace(/\{\{SLUG\}\}/g, slug);

      // Save the article
      await this.saveArticle(metadata, markdown, featuredImage, slug);

      console.log('🎉 ¡Extracción completada!');

    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  extractElementorGalleryContainers(cleanedElement, $) {
    console.log('🖼️ Extracting Elementor gallery containers...');

    const galleryContainers = cleanedElement.find('.elementor-gallery__container');

    console.log(`📸 Found ${galleryContainers.length} gallery containers`);

    galleryContainers.each((galleryIndex, container) => {
      const $container = $(container);
      const galleryItems = $container.find('.e-gallery-item');

      if (galleryItems.length > 1) {
        console.log(`🖼️ Processing gallery with ${galleryItems.length} images`);

        let galleryHtml = '\n<div class="image-gallery">\n<div class="gallery-grid">\n';

        galleryItems.each((i, item) => {
          const $item = $(item);
          const href = $item.attr('href');
          const title = $item.attr('data-elementor-lightbox-title') || '';

          if (href) {
            const filename = this.getImageFilename(href);

            // Add to download list
            this.imagesToDownload.push({
              url: href,
              filename: filename,
              alt: title
            });

            galleryHtml += `<figure class="gallery-item">\n`;
            galleryHtml += `<img src="/images/posts/{{SLUG}}-${filename}" alt="${title}" />\n`;
            galleryHtml += `<figcaption>${title}</figcaption>\n`;
            galleryHtml += `</figure>\n`;
          }
        });

        galleryHtml += '</div>\n</div>\n';

        // Replace the gallery container with our HTML
        $container.replaceWith(galleryHtml);
      }
    });
  }

  extractElementorImages(cleanedElement, $) {
    console.log('🖼️ Extracting regular Elementor images...');

    const elementorImages = cleanedElement.find('.elementor-image');
    console.log(`📸 Found ${elementorImages.length} regular Elementor images`);

    elementorImages.each((index, container) => {
      const $container = $(container);
      const $img = $container.find('img').first();

      if ($img.length) {
        const src = $img.attr('src') || $img.attr('data-src') || '';
        const alt = $img.attr('alt') || '';

        if (src && !this.isLogoImage($img)) {
          console.log(`📷 Processing image ${index + 1}: ${alt || 'No alt'}`);

          const filename = this.getImageFilename(src);

          // Add to download list
          this.imagesToDownload.push({
            url: src,
            filename: filename,
            alt: alt
          });

          // Replace with markdown using local path
          $container.replaceWith(`![${alt}](/images/posts/{{SLUG}}-${filename})`);
        } else {
          $container.remove();
        }
      } else {
        $container.remove();
      }
    });
  }

  removeRelatedSections(cleanedElement, $) {
    const relatedSections = [
      'Estos artículos también pueden interesarte',
      'Artículos relacionados',
      'También te puede interesar',
      'Te puede interesar',
      'Tabla de contenidos'
    ];

    relatedSections.forEach(sectionTitle => {
      cleanedElement.find('*').each((i, element) => {
        const text = $(element).text().trim();
        if (text === sectionTitle) {
          console.log(`🗑️ Removing related section: ${sectionTitle}`);
          $(element).remove();
        }
      });
    });

    // Remove Elementor TOC elements
    cleanedElement.find('.elementor-toc, [class*="table-of-contents"], [class*="toc"]').remove();
    console.log('🗑️ Removed Elementor TOC elements');
  }

  removeLogoImages(cleanedElement, $) {
    cleanedElement.find('a, img').each((i, element) => {
      const $el = $(element);
      const href = $el.attr('href') || '';
      const src = $el.attr('src') || '';
      const alt = $el.attr('alt') || '';

      if (src.includes('tadm-hombre.png') ||
          src.includes('icons8-usa') ||
          src.includes('icons8-spain') ||
          alt.toLowerCase().includes('tadm')) {
        $el.remove();
      }
    });
  }

  isLogoImage($img) {
    const src = $img.attr('src') || '';
    const alt = $img.attr('alt') || '';

    return src.includes('tadm-hombre.png') ||
           src.includes('icons8-usa') ||
           src.includes('icons8-spain') ||
           alt.toLowerCase().includes('tadm');
  }

  processImagePlaceholders(markdown) {
    console.log('🔄 Processing image placeholders...');

    if (this.imageReplacements && this.imageReplacements.length > 0) {
      this.imageReplacements.forEach(replacement => {
        markdown = markdown.replace(replacement.placeholder, replacement.markdown);
      });
    }

    return markdown;
  }

  extractMetadata($, url) {
    const title = $('h1.elementor-heading-title, .entry-title, h1').first().text().trim() ||
                  $('title').text().replace(' - TuAsesorDeModa', '').trim();

    const excerpt = $('meta[name="description"]').attr('content') ||
                   $('meta[property="og:description"]').attr('content') || '';

    const date = new Date().toISOString().split('T')[0];

    return {
      title,
      excerpt,
      date,
      author: 'TuAsesorDeModa',
      categories: ['mujer'],
      tags: ['moda', 'estilo', 'tatuajes', 'belleza'],
      featured: 'true',
      seoTitle: title,
      seoDescription: excerpt,
      originalUrl: url
    };
  }

  getFeaturedImage($, slug = '{{SLUG}}') {
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      const filename = this.getImageFilename(ogImage);
      this.imagesToDownload.push({
        url: ogImage,
        filename: filename,
        alt: 'Featured image'
      });
      return `/images/posts/${slug}-${filename}`;
    }
    return null;
  }

  getImageFilename(url) {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Clean filename
    return filename.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase();
  }

  generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async saveArticle(metadata, content, featuredImage, slug) {

    const frontmatter = `---
title: "${metadata.title}"
excerpt: "${metadata.excerpt}"
date: "${metadata.date}"
author: "${metadata.author}"
categories: ${JSON.stringify(metadata.categories)}
tags: ${JSON.stringify(metadata.tags)}
featured: "${metadata.featured}"
seoTitle: "${metadata.seoTitle}"
seoDescription: "${metadata.seoDescription}"
originalUrl: "${metadata.originalUrl}"${featuredImage ? `\ncoverImage: "${featuredImage}"` : ''}
---

`;

    const fullContent = frontmatter + content;
    const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

    fs.writeFileSync(filePath, fullContent, 'utf8');
    console.log(`💾 Archivo guardado: ${filePath}`);

    // Download images
    if (this.imagesToDownload.length > 0) {
      await this.downloadImages(slug);
    }
  }

  async downloadImages(slug) {
    console.log(`🖼️  Descargando ${this.imagesToDownload.length} imágenes...`);

    const imagesDir = path.join(process.cwd(), 'public', 'images', 'posts');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    for (const image of this.imagesToDownload) {
      try {
        const response = await axios.get(image.url, { responseType: 'stream', timeout: 30000 });
        const finalFilename = `${slug}-${image.filename}`;
        const filepath = path.join(imagesDir, finalFilename);

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`  ✅ ${finalFilename} descargada`);
      } catch (error) {
        console.log(`  ❌ Error descargando ${image.filename}: ${error.message}`);
      }
    }
  }
}

// Run the extractor
async function main() {
  const url = 'https://www.tuasesordemoda.com/tatuajes-para-mujeres-en-la-espalda/';
  const extractor = new TattooExtractor();
  await extractor.extractArticle(url);
}

main().catch(console.error);