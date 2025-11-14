const BlogExtractor = require('./blog-extractor');
const fs = require('fs');
const path = require('path');

class BulkExtractor {
  constructor() {
    this.extractor = new BlogExtractor();
    this.results = [];
    this.errors = [];
  }

  async extractMultipleArticles(urls, delayMs = 2000) {
    console.log(`🚀 Iniciando extracción masiva de ${urls.length} artículos...`);
    console.log(`⏱️  Delay entre requests: ${delayMs}ms\n`);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      try {
        console.log(`\n[${i + 1}/${urls.length}] Procesando: ${url}`);

        // Extract article
        const article = await this.extractor.extractArticle(url);

        // Save markdown file
        await this.extractor.saveMarkdownFile(article);

        // Download images
        const downloadedImages = await this.extractor.downloadImages(article.images);

        this.results.push({
          url,
          article,
          imagesDownloaded: downloadedImages.length,
          totalImages: article.images.length,
          success: true
        });

        console.log(`✅ [${i + 1}/${urls.length}] Completado: ${article.title}`);

        // Delay to avoid overwhelming the server
        if (i < urls.length - 1) {
          console.log(`⏳ Esperando ${delayMs}ms antes del siguiente...`);
          await this.delay(delayMs);
        }

      } catch (error) {
        console.error(`❌ [${i + 1}/${urls.length}] Error con ${url}:`, error.message);
        this.errors.push({ url, error: error.message });
      }
    }

    this.generateReport();
    return { results: this.results, errors: this.errors };
  }

  async extractFromFile(filePath, delayMs = 2000) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const urls = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.startsWith('http'));

      console.log(`📄 URLs encontradas en ${filePath}: ${urls.length}`);

      return await this.extractMultipleArticles(urls, delayMs);

    } catch (error) {
      console.error('❌ Error leyendo archivo de URLs:', error.message);
      throw error;
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 REPORTE DE EXTRACCIÓN MASIVA');
    console.log('='.repeat(60));

    console.log(`✅ Artículos procesados exitosamente: ${this.results.length}`);
    console.log(`❌ Errores: ${this.errors.length}`);

    if (this.results.length > 0) {
      const totalImages = this.results.reduce((sum, r) => sum + r.imagesDownloaded, 0);
      console.log(`🖼️  Total de imágenes descargadas: ${totalImages}`);

      console.log('\n📝 Artículos extraídos:');
      this.results.forEach((result, i) => {
        console.log(`  ${i + 1}. ${result.article.title} (${result.imagesDownloaded}/${result.totalImages} imágenes)`);
      });
    }

    if (this.errors.length > 0) {
      console.log('\n❌ Errores encontrados:');
      this.errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error.url} - ${error.error}`);
      });
    }

    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalProcessed: this.results.length,
        totalErrors: this.errors.length,
        totalImages: this.results.reduce((sum, r) => sum + r.imagesDownloaded, 0)
      },
      results: this.results,
      errors: this.errors
    };

    const reportPath = `./scripts/extraction-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Reporte detallado guardado en: ${reportPath}`);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('❌ Debes proporcionar URLs o un archivo');
    console.log('\nUso:');
    console.log('  node scripts/bulk-extractor.js <url1> <url2> <url3>...');
    console.log('  node scripts/bulk-extractor.js --file urls.txt');
    console.log('  node scripts/bulk-extractor.js --file urls.txt --delay 3000');
    console.log('\nEjemplo de archivo urls.txt:');
    console.log('  https://www.tuasesordemoda.com/articulo1/');
    console.log('  https://www.tuasesordemoda.com/articulo2/');
    process.exit(1);
  }

  const extractor = new BulkExtractor();

  try {
    let urls = [];
    let delayMs = 2000;

    if (args[0] === '--file') {
      const filePath = args[1];
      if (!filePath) {
        throw new Error('Debes especificar la ruta del archivo después de --file');
      }

      // Check for delay parameter
      const delayIndex = args.indexOf('--delay');
      if (delayIndex !== -1 && args[delayIndex + 1]) {
        delayMs = parseInt(args[delayIndex + 1]) || 2000;
      }

      await extractor.extractFromFile(filePath, delayMs);
    } else {
      urls = args.filter(arg => !arg.startsWith('--'));
      await extractor.extractMultipleArticles(urls, delayMs);
    }

  } catch (error) {
    console.error('\n💥 Error durante la extracción masiva:', error.message);
    process.exit(1);
  }
}

module.exports = BulkExtractor;

if (require.main === module) {
  main();
}