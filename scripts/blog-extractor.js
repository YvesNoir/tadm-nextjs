const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

class BlogExtractor {
  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });

    // Configure turndown to handle images better
    this.turndownService.addRule('images', {
      filter: 'img',
      replacement: (content, node) => {
        const alt = node.getAttribute('alt') || '';
        const src = node.getAttribute('src') || '';
        return `![${alt}](${src})`;
      }
    });
  }

  async extractArticle(url) {
    try {
      console.log(`🔍 Extrayendo contenido de: ${url}`);

      // Fetch the webpage
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      // Extract metadata
      const metadata = this.extractMetadata($);

      // Extract main content
      const content = this.extractContent($);

      // Extract images
      const images = this.extractImages($, url);

      // Store images for gallery processing
      this.currentExtractionImages = images;

      // Generate slug from URL
      const slug = this.generateSlug(url);

      // Store slug for image path generation
      this.currentSlug = slug;

      // Process internal links in HTML before markdown conversion
      content.html = this.processInternalLinksInHTML(content.html);

      // Convert HTML to Markdown
      let markdownContent = this.turndownService.turndown(content.html);

      // Process markdown placeholders for galleries
      markdownContent = this.processMarkdownPlaceholders(markdownContent);

      // Process image placeholders
      markdownContent = this.processImagePlaceholders(markdownContent);

      // Normalize text case (lowercase with proper capitalization)
      markdownContent = this.normalizeTextCase(markdownContent);

      // Clean up temporary references
      this.currentExtractionImages = null;
      this.currentSlug = null;

      // Process featured image if found
      let featuredImageLocal = null;
      if (metadata.featuredImage) {
        console.log(`🖼️ Imagen destacada encontrada: ${metadata.featuredImage}`);

        // Add featured image to images array for download
        const featuredImageObj = {
          url: metadata.featuredImage,
          alt: `${metadata.title} - Imagen destacada`,
          caption: ''
        };

        // Add to beginning of images array
        images.unshift(featuredImageObj);

        // Set local path for featured image using slug
        const extension = path.extname(new URL(metadata.featuredImage).pathname) || '.jpg';
        featuredImageLocal = `/images/posts/${slug}${extension}`;
      }

      const article = {
        title: this.normalizeTitle(metadata.title),
        slug: slug,
        excerpt: metadata.description || this.generateExcerpt(markdownContent),
        content: markdownContent,
        publishedAt: metadata.publishedDate || new Date().toISOString(),
        author: 'TuAsesorDeModa',
        categories: this.detectCategories(metadata.title, markdownContent),
        tags: this.extractTags(markdownContent, metadata.keywords),
        seoTitle: this.normalizeTitle(metadata.seoTitle || metadata.title),
        seoDescription: metadata.seoDescription || metadata.description,
        featured: true,
        status: 'published',
        originalUrl: url,
        featuredImage: featuredImageLocal,
        images: images
      };

      console.log(`✅ Artículo extraído: "${article.title}"`);
      console.log(`📊 Estadísticas:`);
      console.log(`   - Contenido: ${markdownContent.length} caracteres`);
      console.log(`   - Imágenes: ${images.length} encontradas`);
      if (featuredImageLocal) {
        console.log(`   - Imagen destacada: ${metadata.featuredImage}`);
      }
      console.log(`   - Categorías: ${article.categories.join(', ')}`);
      console.log(`   - Tags: ${article.tags.join(', ')}`);

      return article;

    } catch (error) {
      console.error(`❌ Error extrayendo artículo de ${url}:`, error.message);
      throw error;
    }
  }

  extractMetadata($) {
    const title = $('h1').first().text().trim() ||
                  $('title').text().trim() ||
                  $('meta[property="og:title"]').attr('content');

    return {
      title: this.normalizeTitle(title),

      description: $('meta[name="description"]').attr('content') ||
                   $('meta[property="og:description"]').attr('content'),

      seoTitle: this.normalizeTitle($('title').text().trim()),

      seoDescription: $('meta[name="description"]').attr('content'),

      keywords: $('meta[name="keywords"]').attr('content'),

      publishedDate: $('meta[property="article:published_time"]').attr('content') ||
                     $('time[datetime]').attr('datetime') ||
                     $('.entry-date, .post-date, .date').text().trim(),

      author: $('meta[name="author"]').attr('content') ||
              $('.author, .by-author').text().trim(),

      canonicalUrl: $('link[rel="canonical"]').attr('href'),

      // Extract featured image from various WordPress sources
      featuredImage: $('meta[property="og:image"]').attr('content') ||
                     $('meta[name="twitter:image"]').attr('content') ||
                     $('.wp-post-image').attr('src') ||
                     $('.featured-image img').first().attr('src') ||
                     $('.entry-thumbnail img').first().attr('src') ||
                     $('.post-thumbnail img').first().attr('src')
    };
  }

  extractContent($) {
    // Priority selector for Elementor posts - most specific first
    const contentSelectors = [
      '[data-elementor-type="wp-post"]', // Elementor post content - HIGHEST PRIORITY
      'article .entry-content', // WordPress articles
      '.entry-content',
      '.post-content',
      '.article-content',
      '.content-area .site-main article .entry-content',
      '.hentry .entry-content',
      'main article .content',
      'article .post-body',
      '.single-post-content',
      '.blog-post-content'
    ];

    let content = { html: '', text: '' };

    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length && element.text().trim().length > 200) {
        // Clone the element to avoid modifying the original
        const cleanedElement = element.clone();

        // If this is Elementor content, apply targeted cleaning
        if (selector === '[data-elementor-type="wp-post"]') {
          console.log('🎯 Elementor post content found - applying targeted cleaning');

          // Remove navigation and branding elements, but preserve galleries
          cleanedElement.find(`
            script, style, iframe[src*="ads"], embed[src*="ads"],
            .ads, .advertisement, .social-share, .share-buttons,
            .comments, .comment-form, .breadcrumbs,
            nav, header, footer, .navigation,
            .skip-link, .screen-reader-text,
            .menu, .nav-menu, .language-switcher, .lang-switcher,
            [class*="flag"], .site-logo, .logo, [class*="logo"],
            .related-posts, .recommended-posts, [class*="related"],
            [class*="recommendation"], [class*="suggest"], [class*="similar"]
          `).not(`
            .elementor-gallery, .wp-block-gallery, .gallery,
            [class*="gallery"]:not([class*="related"]),
            .elementor-image-gallery, .elementor-widget-image-gallery
          `).remove();

          // Extract Elementor galleries first, then individual images
          this.extractElementorGalleries(cleanedElement, $);
          this.extractElementorImages(cleanedElement, $);

          // Remove links containing TADM logos and language flags
          cleanedElement.find('a').each((i, link) => {
            const $link = $(link);
            const href = $link.attr('href') || '';
            const text = $link.text().toLowerCase().trim();

            // Remove links that contain navigation text
            if (text === 'ir al contenido' ||
                text === 'menu' ||
                text === 'menú' ||
                href.includes('tuasesordemoda.com') ||
                href.includes('#content')) {
              $link.remove();
              return;
            }

            // Check if the link contains unwanted images
            const img = $link.find('img').first();
            if (img.length) {
              const src = img.attr('src') || '';
              const alt = img.attr('alt') || '';

              if (src.includes('tadm-hombre.png') ||
                  src.includes('TADM') ||
                  src.includes('icons8-usa') ||
                  src.includes('icons8-spain') ||
                  alt.toLowerCase().includes('tadm') ||
                  alt.toLowerCase().includes('tuasesordemoda')) {
                $link.remove();
              }
            }
          });

          // Remove standalone images (not in links) that are logos/flags
          cleanedElement.find('img').each((i, img) => {
            const src = $(img).attr('src') || '';
            const alt = $(img).attr('alt') || '';

            if (src.includes('tadm-hombre.png') ||
                src.includes('TADM') ||
                src.includes('icons8-usa') ||
                src.includes('icons8-spain') ||
                alt.toLowerCase().includes('tadm') ||
                alt.toLowerCase().includes('tuasesordemoda')) {
              $(img).remove();
            }
          });

          // Remove related articles sections and unwanted elements - more aggressive approach
          const relatedTexts = [
            'Estos artículos también pueden interesarte',
            'Artículos relacionados',
            'También te puede interesar',
            'Últimos artículos',
            'Te puede interesar',
            'Tabla de contenidos'  // Remove Elementor TOC header
          ];

          relatedTexts.forEach(relatedText => {
            cleanedElement.find('*').each((i, elem) => {
              const $elem = $(elem);
              const elemText = $elem.text().trim();

              if (elemText.includes(relatedText)) {
                console.log(`🗑️ Removing related section: ${relatedText}`);

                // Find the heading element (h1-h6) that contains this text
                const heading = $elem.is('h1, h2, h3, h4, h5, h6') ? $elem : $elem.find('h1, h2, h3, h4, h5, h6').first();

                if (heading.length) {
                  // Remove this heading and everything after it
                  let currentElement = heading;
                  while (currentElement.length && currentElement.next().length) {
                    const nextElement = currentElement.next();
                    nextElement.remove();
                    currentElement = nextElement;
                  }
                  heading.remove();
                } else {
                  // Fallback: remove the element and its siblings
                  $elem.nextAll().remove();
                  $elem.remove();
                }
                return false; // Break the loop for this related text
              }
            });
          });

          // Remove Elementor Table of Contents elements specifically
          cleanedElement.find('.elementor-toc__header, .elementor-toc, .elementor-widget-table-of-contents').remove();
          console.log('🗑️ Removed Elementor TOC elements');

          // Remove simple navigation text elements
          cleanedElement.find('*').each((i, elem) => {
            const $elem = $(elem);
            const elemText = $elem.text().toLowerCase().trim();

            if ((elemText === 'ir al contenido' ||
                elemText === 'menu' ||
                elemText === 'menú') &&
                $elem.children().length === 0) {
              $elem.remove();
            }
          });

        } else {
          // Apply aggressive cleaning for other selectors
          cleanedElement.find(`
            script, style, iframe, embed, object,
            .ads, .advertisement, .social-share, .share-buttons,
            .related-posts, .recommended-posts, .post-navigation,
            .comments, .comment-form, .sidebar, .widget,
            .author-bio, .post-meta, .breadcrumbs,
            .tags, .categories, .post-tags, .post-categories,
            .wp-block-latest-posts, .wp-block-archives,
            [class*="related"], [class*="recommendation"],
            [class*="suggest"], [class*="similar"],
            nav, header, footer, aside, .navigation,
            .skip-link, .screen-reader-text, .site-header,
            .site-footer, .main-navigation, .site-branding,
            .custom-logo-link, .site-title, .site-description,
            .menu, .nav-menu, .primary-menu, .secondary-menu,
            .language-switcher, .lang-switcher, .wpml-lang-switcher,
            .flag, .flags, [class*="flag"], [class*="lang"],
            .site-logo, .logo, [class*="logo"]
          `).remove();
        }

        // Apply additional cleaning only for non-Elementor content
        if (selector !== '[data-elementor-type="wp-post"]') {
          // Remove elements with promotional or navigation text
          cleanedElement.find('a').each((i, link) => {
            const linkText = $(link).text().toLowerCase();
            if (linkText.includes('ver más') ||
                linkText.includes('leer más') ||
                linkText.includes('visitar artículo') ||
                linkText.includes('siguiente') ||
                linkText.includes('anterior') ||
                linkText.includes('ir al contenido') ||
                linkText.includes('skip to content')) {
              $(link).parent().remove();
            }
          });

          // Remove specific unwanted elements by content/attributes
          cleanedElement.find('img').each((i, img) => {
            const src = $(img).attr('src') || '';
            const alt = $(img).attr('alt') || '';
            const classes = $(img).attr('class') || '';

            if (src.includes('tadm-hombre.png') ||
                src.includes('TADM') ||
                alt.toLowerCase().includes('tadm') ||
                alt.toLowerCase().includes('tuasesordemoda') ||
                classes.includes('logo') ||
                classes.includes('brand') ||
                $(img).hasClass('custom-logo') ||
                $(img).closest('.site-branding, .site-header, .logo, .brand').length > 0) {
              $(img).remove();
            }
          });

          // Remove country flags and language selectors
          cleanedElement.find('img').each((i, img) => {
            const src = $(img).attr('src') || '';
            const alt = $(img).attr('alt') || '';
            const classes = $(img).attr('class') || '';

            if (src.includes('flag') ||
                src.includes('/flags/') ||
                alt.toLowerCase().includes('flag') ||
                alt.toLowerCase().includes('bandera') ||
                alt.toLowerCase().includes('english') ||
                alt.toLowerCase().includes('spanish') ||
                alt.toLowerCase().includes('español') ||
                classes.includes('flag') ||
                $(img).closest('.language-switcher, .lang-switcher, .wpml-lang-switcher, .menu').length > 0) {
              let parentToRemove = $(img).closest('li, div, span').length > 0 ?
                                  $(img).closest('li, div, span') : $(img);
              parentToRemove.remove();
            }
          });

          // Remove elements with specific text patterns
          cleanedElement.find('*').each((i, elem) => {
            const elemText = $(elem).text().toLowerCase().trim();
            if (elemText === 'ir al contenido' ||
                elemText === 'skip to content' ||
                elemText.includes('menú principal') ||
                elemText.includes('main menu') ||
                elemText === 'menu' ||
                elemText === 'menú' ||
                elemText.includes('tadm') ||
                elemText.includes('tuasesordemoda') ||
                (elemText.length < 10 && elemText.includes('español')) ||
                (elemText.length < 10 && elemText.includes('english'))) {
              $(elem).remove();
            }
          });
        }

        content.html = cleanedElement.html();
        content.text = cleanedElement.text().trim();

        // Post-process to remove related articles section from HTML
        if (selector === '[data-elementor-type="wp-post"]') {
          content.html = this.removeRelatedArticlesFromHTML(content.html);
        }

        // Validate content quality
        if (this.validateContent(content.text)) {
          break;
        }
      }
    }

    // Enhanced fallback with better filtering
    if (!content.html || !this.validateContent(content.text)) {
      // Remove navigation and promotional elements from body
      $(`script, style, nav, header, footer, aside,
         .sidebar, .ads, .navigation, .breadcrumbs,
         .related-posts, .widget, .comments`).remove();

      const bodyContent = $('body');
      content.html = bodyContent.html();
      content.text = bodyContent.text().trim();
    }

    return content;
  }

  removeRelatedArticlesFromHTML(html) {
    // Simple approach: cut content after finding "Estos artículos también pueden interesarte"
    const relatedTexts = [
      'Estos artículos también pueden interesarte',
      'Artículos relacionados',
      'También te puede interesar',
      'Últimos artículos',
      'Te puede interesar'
    ];

    let cleanedHTML = html;

    relatedTexts.forEach(relatedText => {
      // Find the position of the related text
      const position = cleanedHTML.indexOf(relatedText);
      if (position !== -1) {
        console.log(`✂️ Cutting content after: ${relatedText}`);
        // Cut everything from that point onwards
        cleanedHTML = cleanedHTML.substring(0, position);
      }
    });

    return cleanedHTML;
  }

  processMarkdownPlaceholders(markdownContent) {
    // Replace markdown placeholders with actual content
    return markdownContent.replace(
      /<div class="markdown-placeholder">(.*?)<\/div>/gs,
      (match, content) => {
        // Decode HTML entities and clean up
        return content.replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&amp;/g, '&');
      }
    );
  }

  normalizeTextCase(markdownContent) {
    console.log('📝 Normalizing text case...');

    // Split by lines to preserve markdown structure
    const lines = markdownContent.split('\n');

    const normalizedLines = lines.map(line => {
      // Skip if line is empty, markdown syntax, or HTML
      if (!line.trim() ||
          line.startsWith('#') ||
          line.startsWith('!') ||
          line.startsWith('[') ||
          line.startsWith('<') ||
          line.includes('```')) {
        return line;
      }

      // Convert to lowercase and then capitalize first letter of sentences
      const lowerLine = line.toLowerCase();

      // Capitalize after periods, question marks, exclamation marks
      return lowerLine.replace(/(^|\.\s*|\?\s*|\!\s*)([a-z])/g, function(match, punctuation, letter) {
        return punctuation + letter.toUpperCase();
      });
    });

    return normalizedLines.join('\n');
  }

  normalizeTitle(title) {
    if (!title) return title;

    // Convert to lowercase first
    let normalized = title.toLowerCase();

    // Capitalize first letter of the title
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1);

    // Capitalize after punctuation marks (periods, question marks, exclamation marks)
    normalized = normalized.replace(/([\.\?\!]\s*)([a-z])/g, function(match, punctuation, letter) {
      return punctuation + letter.toUpperCase();
    });

    return normalized;
  }

  processInternalLinksInHTML(html) {
    console.log('🔗 Processing internal links in HTML...');

    // Convert WordPress internal links to our site structure
    return html.replace(
      /<a[^>]+href="https:\/\/www\.tuasesordemoda\.com\/([^/"]+)\/?[^"]*"[^>]*>([^<]+)<\/a>/g,
      (match, slug, linkText) => {
        // Detect category based on common patterns or default to 'hombre'
        let category = 'hombre'; // Default category

        // Map specific slugs to categories if needed
        const categoryMappings = {
          'moda-para-mujer': 'mujer',
          'moda-para-hombre': 'hombre',
          'zapatos': 'zapatos',
          'belleza': 'belleza'
        };

        // Check if slug contains category indicators
        if (slug.includes('mujer')) {
          category = 'mujer';
        } else if (slug.includes('zapato') || slug.includes('calzado')) {
          category = 'zapatos';
        } else if (slug.includes('belleza') || slug.includes('makeup') || slug.includes('perfume')) {
          category = 'belleza';
        }

        // Apply specific mappings if they exist
        if (categoryMappings[slug]) {
          category = categoryMappings[slug];
        }

        const newUrl = `/${category}/${slug}`;
        console.log(`  🔗 Converting HTML link: ${slug} → ${newUrl}`);

        return `<a href="${newUrl}">${linkText}</a>`;
      }
    );
  }

  processInternalLinks(markdownContent) {
    console.log('🔗 Processing internal links...');

    // Convert WordPress internal links to our site structure
    return markdownContent.replace(
      /\[([^\]]+)\]\(https:\/\/www\.tuasesordemoda\.com\/([^/)]+)\/?\)/g,
      (match, linkText, slug) => {
        // Detect category based on common patterns or default to 'hombre'
        let category = 'hombre'; // Default category

        // Map specific slugs to categories if needed
        const categoryMappings = {
          'moda-para-mujer': 'mujer',
          'moda-para-hombre': 'hombre',
          'zapatos': 'zapatos',
          'belleza': 'belleza'
        };

        // Check if slug contains category indicators
        if (slug.includes('mujer')) {
          category = 'mujer';
        } else if (slug.includes('zapato') || slug.includes('calzado')) {
          category = 'zapatos';
        } else if (slug.includes('belleza') || slug.includes('makeup') || slug.includes('perfume')) {
          category = 'belleza';
        }

        // Apply specific mappings if they exist
        if (categoryMappings[slug]) {
          category = categoryMappings[slug];
        }

        const newUrl = `/${category}/${slug}`;
        console.log(`  🔗 Converting: ${slug} → ${newUrl}`);

        return `[${linkText}](${newUrl})`;
      }
    );
  }

  processImagePlaceholders(markdownContent) {
    if (!this.imageReplacements) return markdownContent;

    console.log(`🔄 Processing ${this.imageReplacements.length} image placeholders...`);

    let processedContent = markdownContent;

    // Separate gallery placeholders from image placeholders
    const galleryPlaceholders = this.imageReplacements.filter(({ placeholder }) =>
      placeholder.includes('GALLERYPLACEHOLDER'));
    const imagePlaceholders = this.imageReplacements.filter(({ placeholder }) =>
      placeholder.includes('IMAGEPLACEHOLDER'));

    // Process gallery placeholders directly (no grouping needed)
    galleryPlaceholders.forEach(({ placeholder, markdown }) => {
      console.log(`🎨 Inserting gallery: ${placeholder}`);
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), `\n\n${markdown}\n\n`);
    });

    // Process image placeholders with temporary markers for grouping
    imagePlaceholders.forEach(({ placeholder, markdown }) => {
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), `\n\nIMAGEMARKER:::${markdown}:::IMAGEMARKER\n\n`);
    });

    // Only apply automatic gallery creation to individual images
    if (imagePlaceholders.length > 0) {
      processedContent = this.createAutomaticGalleries(processedContent);
    }

    // Reset for next article
    this.imageReplacements = [];

    return processedContent;
  }

  createAutomaticGalleries(content) {
    console.log('🖼️ Detecting consecutive images for automatic galleries...');

    // Split content by lines and identify image markers
    const lines = content.split('\n');
    const processedLines = [];
    let currentImageGroup = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('IMAGEMARKER:::')) {
        // Extract the markdown from the marker
        const markdown = line.replace('IMAGEMARKER:::', '').replace(':::IMAGEMARKER', '');
        currentImageGroup.push(markdown);
      } else if (line === '' && currentImageGroup.length > 0) {
        // Empty line - continue collecting if next line might be another image
        const nextNonEmptyIndex = this.findNextNonEmptyLine(lines, i + 1);
        if (nextNonEmptyIndex !== -1 && lines[nextNonEmptyIndex].trim().startsWith('IMAGEMARKER:::')) {
          // Next non-empty line is also an image, keep collecting
          continue;
        } else {
          // Next line is not an image, process current group
          this.processImageGroup(currentImageGroup, processedLines);
          currentImageGroup = [];
          processedLines.push(line);
        }
      } else {
        // Regular content line
        if (currentImageGroup.length > 0) {
          // Process any pending image group
          this.processImageGroup(currentImageGroup, processedLines);
          currentImageGroup = [];
        }
        processedLines.push(line);
      }
    }

    // Process any remaining image group
    if (currentImageGroup.length > 0) {
      this.processImageGroup(currentImageGroup, processedLines);
    }

    return processedLines.join('\n');
  }

  findNextNonEmptyLine(lines, startIndex) {
    for (let i = startIndex; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        return i;
      }
    }
    return -1;
  }

  processImageGroup(imageGroup, processedLines) {
    if (imageGroup.length === 1) {
      // Single image - display at full width
      console.log('📷 Single image detected - full width');
      processedLines.push('');
      processedLines.push(imageGroup[0]);
      processedLines.push('');
    } else if (imageGroup.length >= 2) {
      // Multiple consecutive images - create gallery
      console.log(`🖼️ Gallery detected with ${imageGroup.length} images`);

      // Create gallery HTML with 3-column grid
      processedLines.push('');
      processedLines.push('<div class="image-gallery">');
      processedLines.push('<div class="gallery-grid">');

      imageGroup.forEach((imageMarkdown, index) => {
        // Extract alt and src from markdown: ![alt](src)
        const match = imageMarkdown.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (match) {
          const [, alt, originalSrc] = match;

          // Find the corresponding local image path
          const localSrc = this.getLocalImagePath(originalSrc);

          processedLines.push(`<figure class="gallery-item">`);
          processedLines.push(`<img src="${localSrc}" alt="${alt}" />`);
          if (alt) {
            processedLines.push(`<figcaption>${alt}</figcaption>`);
          }
          processedLines.push(`</figure>`);
        }
      });

      processedLines.push('</div>');
      processedLines.push('</div>');
      processedLines.push('');
    }
  }

  getLocalImagePath(originalUrl) {
    // Find the image in our current extraction images array that matches this URL
    if (this.currentExtractionImages && this.currentSlug) {
      const imageIndex = this.currentExtractionImages.findIndex(img => img.url === originalUrl);
      if (imageIndex !== -1) {
        const extension = path.extname(new URL(originalUrl).pathname) || '.jpg';

        // If it's the featured image (first image with correct alt text)
        const image = this.currentExtractionImages[imageIndex];
        const isFeaturedImage = imageIndex === 0 && image.alt && image.alt.includes('Imagen destacada');

        if (isFeaturedImage) {
          return `/images/posts/${this.currentSlug}${extension}`;
        } else {
          // Extract original filename from URL
          const urlPath = new URL(originalUrl).pathname;
          const originalName = path.basename(urlPath, path.extname(urlPath));
          const cleanName = originalName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
          return `/images/posts/${this.currentSlug}-${cleanName}${extension}`;
        }
      }
    }

    // Fallback to original URL if not found (shouldn't happen)
    console.warn(`⚠️ Could not find local image for: ${originalUrl}`);
    return originalUrl;
  }

  extractElementorImages(cleanedElement, $) {
    console.log('🖼️ Extracting Elementor images in their original order...');

    // Find all Elementor image containers in the order they appear
    const elementorImages = cleanedElement.find('.elementor-image');

    console.log(`📸 Found ${elementorImages.length} Elementor images`);

    elementorImages.each((index, container) => {
      const $container = $(container);
      const $img = $container.find('img').first();

      if ($img.length) {
        const src = $img.attr('src') || $img.attr('data-src') || '';
        const alt = $img.attr('alt') || '';

        if (src && !this.isLogoImage($img)) {
          console.log(`📷 Processing image ${index + 1}: ${alt || 'No alt'}`);

          // Create a placeholder that won't get escaped by Turndown
          const imagePlaceholder = `IMAGEPLACEHOLDER${index}PLACEHOLDER`;

          // Store the image info for later processing
          if (!this.imageReplacements) this.imageReplacements = [];
          this.imageReplacements.push({
            placeholder: imagePlaceholder,
            markdown: `![${alt}](${src})`
          });

          // Replace the container with the placeholder
          $container.replaceWith(imagePlaceholder);
        } else {
          // Remove logo images
          $container.remove();
        }
      } else {
        // Remove containers without images
        $container.remove();
      }
    });
  }

  extractElementorGalleries(cleanedElement, $) {
    console.log('🎨 Extracting Elementor galleries...');

    // Look for Elementor gallery widgets specifically
    const galleryWidgets = cleanedElement.find('.elementor-widget-gallery');

    console.log(`🖼️ Found ${galleryWidgets.length} Elementor gallery widgets`);

    galleryWidgets.each((galleryIndex, galleryWidget) => {
      const $gallery = $(galleryWidget);
      const galleryContainer = $gallery.find('.e-gallery-container').first();

      if (galleryContainer.length) {
        console.log(`🎨 Processing gallery ${galleryIndex + 1}`);

        // Find all gallery items within this gallery
        const galleryItems = galleryContainer.find('.e-gallery-item');
        console.log(`📸 Found ${galleryItems.length} items in gallery ${galleryIndex + 1}`);

        if (galleryItems.length >= 2) {
          // Create gallery markdown
          let galleryMarkdown = '\n\n<div class="image-gallery">\n';
          galleryMarkdown += '<div class="gallery-title">Inspiración de looks para esta temporada</div>\n';
          galleryMarkdown += '<div class="gallery-grid">\n';

          let galleryImageCount = 0;

          galleryItems.each((itemIndex, item) => {
            const $item = $(item);

            // Debug information
            console.log(`🔍 Debugging item ${itemIndex + 1}:`);
            console.log(`   - href: ${$item.attr('href') || 'NONE'}`);
            console.log(`   - data-elementor-open-lightbox: ${$item.attr('data-elementor-open-lightbox') || 'NONE'}`);

            const galleryImage = $item.find('.e-gallery-image');
            const bgStyle = galleryImage.attr('style') || '';
            console.log(`   - background style: ${bgStyle}`);
            console.log(`   - data-thumbnail: ${galleryImage.attr('data-thumbnail') || 'NONE'}`);

            // Try different selectors to find the image URL
            let imageUrl = '';
            const href = $item.attr('href') || '';

            // Extract URL from href (link to full image)
            if (href && (href.includes('.jpg') || href.includes('.png') || href.includes('.jpeg'))) {
              imageUrl = href;
              console.log(`   ✅ Found URL from href: ${imageUrl}`);
            }
            // Extract URL from background-image style
            else if (bgStyle && bgStyle.includes('background-image: url(')) {
              const match = bgStyle.match(/background-image:\s*url\(["']?(.*?)["']?\)/);
              if (match && match[1]) {
                imageUrl = match[1];
                console.log(`   ✅ Found URL from background: ${imageUrl}`);
              }
            }
            // Try data-thumbnail as fallback
            else {
              const thumbnail = galleryImage.attr('data-thumbnail');
              if (thumbnail && (thumbnail.includes('.jpg') || thumbnail.includes('.png') || thumbnail.includes('.jpeg'))) {
                imageUrl = thumbnail;
                console.log(`   ✅ Found URL from data-thumbnail: ${imageUrl}`);
              }
            }

            if (imageUrl) {
              galleryImageCount++;
              const alt = `outfit-primavera-look-${galleryImageCount}`;

              console.log(`📷 Processing gallery image ${galleryImageCount}: ${imageUrl}`);

              galleryMarkdown += `<figure class="gallery-item">\n`;
              galleryMarkdown += `<img src="${imageUrl}" alt="${alt}">\n`;
              galleryMarkdown += `<figcaption>${alt}</figcaption>\n`;
              galleryMarkdown += `</figure>\n`;

              // Add to images array for download
              if (!this.currentExtractionImages) this.currentExtractionImages = [];
              this.currentExtractionImages.push({
                url: imageUrl,
                alt: alt,
                caption: alt
              });
            }
          });

          galleryMarkdown += '</div>\n';
          galleryMarkdown += '</div>\n\n';

          // Replace the entire gallery widget with our markdown
          const placeholder = `GALLERYPLACEHOLDER${galleryIndex}PLACEHOLDER`;

          // Store for later processing
          if (!this.imageReplacements) this.imageReplacements = [];
          this.imageReplacements.push({
            placeholder: placeholder,
            markdown: galleryMarkdown
          });

          $gallery.replaceWith(placeholder);

          console.log(`✅ Processed gallery ${galleryIndex + 1} with ${galleryImageCount} images`);
        } else {
          console.log(`⏭️ Skipping gallery ${galleryIndex + 1} - not enough images (${galleryItems.length})`);
        }
      }
    });
  }

  preserveImageGalleries(cleanedElement, $) {
    console.log('🖼️ Looking for image galleries to preserve...');

    // Look for various gallery patterns
    const gallerySelectors = [
      '.elementor-gallery',
      '.wp-block-gallery',
      '.gallery',
      '.elementor-image-gallery',
      '.elementor-widget-image-gallery',
      '[class*="gallery"]:not([class*="related"])',
      '.elementor-widget-gallery',
      '.wp-caption-text'
    ];

    gallerySelectors.forEach(selector => {
      const galleries = cleanedElement.find(selector);
      if (galleries.length > 0) {
        console.log(`📸 Found ${galleries.length} galleries with selector: ${selector}`);

        galleries.each((i, gallery) => {
          const $gallery = $(gallery);
          const images = $gallery.find('img');

          if (images.length > 1) { // Only process if it's actually a gallery
            console.log(`🖼️ Processing gallery with ${images.length} images`);

            // Convert gallery to a simple HTML structure
            const galleryHtml = this.createGalleryHTML($gallery, images);
            $gallery.replaceWith(galleryHtml);
          }
        });
      }
    });

    // Temporarily disabled - focusing on Elementor images first
    // this.detectImageSequences(cleanedElement, $);
    // this.detectImageSequencesOldWay(cleanedElement, $);
  }

  createGalleryHTML($gallery, images) {
    const galleryTitle = $gallery.find('.gallery-caption, .wp-caption-text').first().text().trim();

    let galleryHtml = '<div class="image-gallery">\n';

    if (galleryTitle) {
      galleryHtml += `  <p class="gallery-title"><strong>${galleryTitle}</strong></p>\n`;
    }

    galleryHtml += '  <div class="gallery-grid">\n';

    images.each((i, img) => {
      const $img = $(img);
      const src = $img.attr('src') || $img.attr('data-src') || '';
      const alt = $img.attr('alt') || '';
      const caption = $img.closest('figure').find('figcaption').text().trim();

      if (src) {
        galleryHtml += `    <figure class="gallery-item">\n`;
        galleryHtml += `      <img src="${src}" alt="${alt}" />\n`;
        if (caption) {
          galleryHtml += `      <figcaption>${caption}</figcaption>\n`;
        }
        galleryHtml += `    </figure>\n`;
      }
    });

    galleryHtml += '  </div>\n</div>\n';

    return galleryHtml;
  }

  detectImageSequences(cleanedElement, $) {
    console.log('🔍 Looking for image sequences in their original positions...');

    // Instead of processing all images at once, find sequences by analyzing the DOM structure
    // Walk through the content and look for consecutive image elements
    const contentChildren = cleanedElement.children();
    let imageSequence = [];
    let sequenceStartElement = null;

    contentChildren.each((i, element) => {
      const $element = $(element);

      // Check if this element contains an image or is an image
      const $img = $element.is('img') ? $element : $element.find('img').first();

      if ($img.length && !this.isLogoImage($img) &&
          !$img.closest('.image-gallery, .gallery').length) {

        // This element has a valid image, add to sequence
        if (imageSequence.length === 0) {
          sequenceStartElement = $element;
        }
        imageSequence.push({ element: $element, img: $img });

      } else {
        // No valid image in this element, check if we have a sequence to process
        if (imageSequence.length >= 3) {
          console.log(`🎨 Found image sequence of ${imageSequence.length} at position ${i}`);
          this.convertInPlaceSequenceToGallery(imageSequence, sequenceStartElement, $);
        }
        imageSequence = [];
        sequenceStartElement = null;
      }
    });

    // Process final sequence if it exists
    if (imageSequence.length >= 3) {
      console.log(`🎨 Found final image sequence of ${imageSequence.length}`);
      this.convertInPlaceSequenceToGallery(imageSequence, sequenceStartElement, $);
    }
  }

  isLogoImage($img) {
    const src = $img.attr('src') || '';
    const alt = $img.attr('alt') || '';

    return src.includes('tadm-hombre.png') ||
           src.includes('logo') ||
           alt.toLowerCase().includes('logo') ||
           alt.toLowerCase().includes('tadm');
  }

  convertInPlaceSequenceToGallery(imageSequence, sequenceStartElement, $) {
    console.log(`🎨 Converting in-place sequence of ${imageSequence.length} images to gallery`);

    let galleryHtml = '<div class="image-gallery detected-sequence">\n';
    galleryHtml += '  <div class="gallery-grid">\n';

    imageSequence.forEach(({ element, img }) => {
      const $img = img;
      const src = $img.attr('src') || $img.attr('data-src') || '';
      const alt = $img.attr('alt') || '';

      if (src) {
        galleryHtml += `    <figure class="gallery-item">\n`;
        galleryHtml += `      <img src="${src}" alt="${alt}" />\n`;
        galleryHtml += `    </figure>\n`;
      }

      // Remove all elements in the sequence except the first one
      if (element[0] !== sequenceStartElement[0]) {
        element.remove();
      }
    });

    galleryHtml += '  </div>\n</div>\n';

    // Replace the first element with the gallery
    sequenceStartElement.replaceWith(galleryHtml);
  }

  detectImageSequencesOldWay(cleanedElement, $) {
    console.log('🔍 Fallback: Looking for image sequences with old algorithm...');

    // Look for sequences of 3+ images that might be an unstructured gallery
    const allImages = cleanedElement.find('img');
    let imageSequence = [];

    if (allImages.length < 3) {
      console.log('📸 Not enough images for gallery detection');
      return;
    }

    allImages.each((i, img) => {
      const $img = $(img);

      // Skip images that are already in galleries or are logos
      if ($img.closest('.image-gallery, .gallery').length > 0 ||
          this.isLogoImage($img)) {
        if (imageSequence.length >= 3) {
          this.convertSequenceToGalleryImproved(imageSequence, $);
        }
        imageSequence = [];
        return;
      }

      imageSequence.push($img);
    });

    // Process final sequence if it exists
    if (imageSequence.length >= 3) {
      this.convertSequenceToGalleryImproved(imageSequence, $);
    }
  }

  convertSequenceToGalleryImproved(imageSequence, $) {
    console.log(`🎨 Converting sequence of ${imageSequence.length} images to gallery (improved)`);

    // Find where to insert the gallery by looking for context clues
    const firstImg = imageSequence[0];

    // Look for a heading or paragraph before the first image that might give context
    let insertionPoint = firstImg;
    let prevElement = firstImg.prev();

    while (prevElement.length) {
      const text = prevElement.text().toLowerCase();
      if (prevElement.is('h1, h2, h3, h4, h5, h6, p') &&
          (text.includes('famosos') || text.includes('famous') || text.includes('rostro diamante'))) {
        insertionPoint = prevElement;
        break;
      }
      prevElement = prevElement.prev();
    }

    // Generate markdown for the gallery instead of HTML
    let galleryMarkdown = '\n\n<!-- Gallery: Famosos con rostro diamante -->\n\n';

    imageSequence.forEach($img => {
      const src = $img.attr('src') || $img.attr('data-src') || '';
      const alt = $img.attr('alt') || '';

      if (src) {
        galleryMarkdown += `![${alt}](${src})\n\n`;
      }

      // Remove all original images
      $img.remove();
    });

    galleryMarkdown += '\n<!-- End Gallery -->\n\n';

    // Insert the gallery markdown after the insertion point
    insertionPoint.after(`<div class="markdown-placeholder">${galleryMarkdown}</div>`);
  }

  convertSequenceToGallery(imageSequence, $) {
    console.log(`🎨 Converting sequence of ${imageSequence.length} images to gallery`);

    const firstImg = imageSequence[0];
    let galleryHtml = '<div class="image-gallery detected-sequence">\n';
    galleryHtml += '  <div class="gallery-grid">\n';

    imageSequence.forEach($img => {
      const src = $img.attr('src') || $img.attr('data-src') || '';
      const alt = $img.attr('alt') || '';

      if (src) {
        galleryHtml += `    <figure class="gallery-item">\n`;
        galleryHtml += `      <img src="${src}" alt="${alt}" />\n`;
        galleryHtml += `    </figure>\n`;
      }

      // Remove original images except the first one
      if ($img[0] !== firstImg[0]) {
        $img.remove();
      }
    });

    galleryHtml += '  </div>\n</div>\n';

    // Replace the first image with the gallery
    firstImg.replaceWith(galleryHtml);
  }

  validateContent(text) {
    // Validate that we have substantial, relevant content
    const wordCount = text.split(/\s+/).length;
    const hasSubstantialContent = wordCount > 100;

    // Check for navigation patterns that suggest wrong content
    const navigationPatterns = [
      /ver más en/gi,
      /visitar artículo/gi,
      /artículos relacionados/gi,
      /siguiente.*anterior/gi,
      /categorías.*tags/gi
    ];

    const hasNavigationContent = navigationPatterns.some(pattern =>
      pattern.test(text)
    );

    return hasSubstantialContent && !hasNavigationContent;
  }

  extractImages($, baseUrl) {
    const images = [];
    const processedUrls = new Set();

    $('img').each((i, img) => {
      const $img = $(img);
      let src = $img.attr('src') || $img.attr('data-src') || $img.attr('data-lazy-src');

      if (src && !processedUrls.has(src)) {
        processedUrls.add(src);

        // Convert relative URLs to absolute
        if (src.startsWith('/')) {
          const urlObj = new URL(baseUrl);
          src = `${urlObj.protocol}//${urlObj.host}${src}`;
        } else if (!src.startsWith('http')) {
          src = new URL(src, baseUrl).href;
        }

        images.push({
          url: src,
          alt: $img.attr('alt') || '',
          title: $img.attr('title') || '',
          width: $img.attr('width') || null,
          height: $img.attr('height') || null
        });
      }
    });

    return images;
  }

  generateSlug(url) {
    const urlPath = new URL(url).pathname;
    let slug = urlPath.split('/').filter(segment => segment).pop() || '';

    // Clean the slug
    slug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return slug || 'articulo-importado';
  }

  generateExcerpt(markdownContent, maxLength = 160) {
    // Clean markdown and get first substantial paragraph
    let plainText = markdownContent
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    // Remove common navigation phrases
    plainText = plainText.replace(/^(Ver más|Leer más|Visitar artículo|Siguiente|Anterior).*?\.?/gi, '');

    // Get the first meaningful sentence or paragraph
    const sentences = plainText.split(/[.!?]+/);
    let excerpt = '';

    for (const sentence of sentences) {
      const cleanSentence = sentence.trim();
      if (cleanSentence.length > 20 && !cleanSentence.match(/^(Ver|Leer|Visitar|Siguiente)/i)) {
        excerpt = cleanSentence;
        break;
      }
    }

    // Fallback to first part if no good sentence found
    if (!excerpt) {
      excerpt = plainText.substring(0, maxLength);
    }

    // Ensure we don't exceed max length
    if (excerpt.length > maxLength) {
      excerpt = excerpt.substring(0, maxLength).replace(/\s+\w*$/, '').trim() + '...';
    }

    return excerpt || 'Descubre más sobre este tema de moda y estilo.';
  }

  detectCategories(title, content) {
    const text = (title + ' ' + content).toLowerCase();

    // Check title first for primary category (higher priority)
    const titleText = title.toLowerCase();

    const categoryMap = {
      'hombre': ['hombre', 'masculino', 'caballero', 'él', 'para hombre', 'de hombre'],
      'mujer': ['mujer', 'femenino', 'dama', 'ella', 'para mujer', 'de mujer'],
      'belleza': ['belleza', 'makeup', 'maquillaje', 'skincare', 'cuidado'],
      'zapatos': ['zapatos', 'calzado', 'botas', 'sneakers', 'tacones'],
      'perfumes': ['perfume', 'fragancia', 'colonia', 'aroma'],
      'salud': ['salud', 'bienestar', 'ejercicio', 'nutrición']
    };

    // Priority detection: check title first
    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => titleText.includes(keyword))) {
        // If title clearly indicates a primary category, return only that one
        if (category === 'hombre' || category === 'mujer') {
          return [category];
        }
      }
    }

    // If no clear primary category in title, check full content
    const categories = [];
    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        categories.push(category);
      }
    }

    // Remove conflicting gender categories - prioritize by content frequency
    if (categories.includes('hombre') && categories.includes('mujer')) {
      const hombreCount = (text.match(/hombre|masculino|caballero|él/g) || []).length;
      const mujerCount = (text.match(/mujer|femenino|dama|ella/g) || []).length;

      if (hombreCount > mujerCount) {
        categories.splice(categories.indexOf('mujer'), 1);
      } else {
        categories.splice(categories.indexOf('hombre'), 1);
      }
    }

    // Default category if none detected
    if (categories.length === 0) {
      categories.push('mujer'); // Assuming most content is about fashion
    }

    return categories;
  }

  extractTags(content, keywords = '') {
    const tags = new Set();
    const text = content.toLowerCase();

    // Common fashion tags
    const commonTags = [
      'moda', 'estilo', 'tendencias', 'outfit', 'look', 'fashion',
      'ropa', 'vestimenta', 'accesorios', 'complementos',
      'temporada', 'verano', 'invierno', 'otoño', 'primavera',
      'casual', 'formal', 'elegante', 'deportivo'
    ];

    // Add tags from keywords meta
    if (keywords) {
      keywords.split(',').forEach(tag => {
        const cleanTag = tag.trim().toLowerCase();
        if (cleanTag) tags.add(cleanTag);
      });
    }

    // Add common tags found in content
    commonTags.forEach(tag => {
      if (text.includes(tag)) {
        tags.add(tag);
      }
    });

    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  async saveMarkdownFile(article, outputDir = './content/posts') {
    try {
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Create frontmatter
      const frontmatter = {
        title: article.title,
        excerpt: article.excerpt,
        date: new Date(article.publishedAt).toISOString().split('T')[0],
        author: article.author,
        categories: article.categories,
        tags: article.tags,
        featured: article.featured,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        originalUrl: article.originalUrl
      };

      // Add featured image if available
      if (article.featuredImage) {
        frontmatter.coverImage = article.featuredImage;
      }

      // Create the full markdown content
      const markdownFile = `---
${Object.entries(frontmatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
  }
  return `${key}: "${value}"`;
}).join('\n')}
---

${article.content}`;

      // Save to file
      const filename = `${article.slug}.md`;
      const filepath = path.join(outputDir, filename);

      fs.writeFileSync(filepath, markdownFile, 'utf8');

      console.log(`💾 Archivo guardado: ${filepath}`);

      return filepath;

    } catch (error) {
      console.error('❌ Error guardando archivo:', error.message);
      throw error;
    }
  }

  async downloadImages(images, slug, outputDir = './public/images/posts') {
    try {
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      console.log(`🖼️  Descargando ${images.length} imágenes...`);

      const downloadPromises = images.map(async (image, index) => {
        try {
          const response = await axios.get(image.url, { responseType: 'stream' });
          const extension = path.extname(new URL(image.url).pathname) || '.jpg';

          // Check if this is the featured image (first image if it has specific alt text)
          const isFeaturedImage = index === 0 && image.alt && image.alt.includes('Imagen destacada');

          let filename;
          if (isFeaturedImage) {
            filename = `${slug}${extension}`;
          } else {
            // Extract original filename from URL
            const urlPath = new URL(image.url).pathname;
            const originalName = path.basename(urlPath, path.extname(urlPath));

            // Clean the filename and make it unique with slug prefix
            const cleanName = originalName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
            filename = `${slug}-${cleanName}${extension}`;
          }
          const filepath = path.join(outputDir, filename);

          const writer = fs.createWriteStream(filepath);
          response.data.pipe(writer);

          return new Promise((resolve, reject) => {
            writer.on('finish', () => {
              console.log(`  ✅ ${filename} descargada`);
              resolve({ originalUrl: image.url, localPath: `/images/posts/${filename}` });
            });
            writer.on('error', reject);
          });
        } catch (error) {
          console.error(`  ❌ Error descargando ${image.url}:`, error.message);
          return null;
        }
      });

      const results = await Promise.all(downloadPromises);
      return results.filter(result => result !== null);

    } catch (error) {
      console.error('❌ Error descargando imágenes:', error.message);
      return [];
    }
  }
}

// CLI Usage
async function main() {
  const url = process.argv[2];

  if (!url) {
    console.log('❌ Por favor proporciona una URL');
    console.log('Uso: node scripts/blog-extractor.js <URL>');
    console.log('Ejemplo: node scripts/blog-extractor.js https://www.tuasesordemoda.com/cara-diamante-hombre/');
    process.exit(1);
  }

  const extractor = new BlogExtractor();

  try {
    // Extract article
    const article = await extractor.extractArticle(url);

    // Save markdown file
    await extractor.saveMarkdownFile(article);

    // Download images
    const downloadedImages = await extractor.downloadImages(article.images, article.slug);

    console.log('\n🎉 ¡Extracción completada!');
    console.log(`📄 Artículo: ${article.title}`);
    console.log(`🔗 Slug: ${article.slug}`);
    console.log(`🖼️  Imágenes descargadas: ${downloadedImages.length}/${article.images.length}`);

  } catch (error) {
    console.error('\n💥 Error durante la extracción:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = BlogExtractor;

// Run if called directly
if (require.main === module) {
  main();
}