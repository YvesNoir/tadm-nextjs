const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Script para generar mapeo de redirects automático
 * Lee todos los artículos y crea un mapeo de slug -> categoría
 */

const POSTS_DIRECTORY = path.join(process.cwd(), 'content/posts');

function generateRedirectsMapping() {
  const redirectsMap = {};

  try {
    const files = fs.readdirSync(POSTS_DIRECTORY);

    files.forEach(file => {
      if (path.extname(file) === '.md') {
        const filePath = path.join(POSTS_DIRECTORY, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');

        try {
          const { data } = matter(fileContents);
          const slug = path.basename(file, '.md');

          // Obtener categoría principal
          if (data.categories && data.categories.length > 0) {
            const category = data.categories[0]; // Primera categoría
            redirectsMap[slug] = category;
            console.log(`✓ ${slug} -> ${category}`);
          } else {
            console.log(`⚠️  ${slug} - Sin categoría definida`);
            redirectsMap[slug] = 'general'; // Fallback
          }
        } catch (error) {
          console.error(`❌ Error procesando ${file}:`, error.message);
        }
      }
    });

    // Generar archivo de configuración
    const configContent = `// Configuración automática de redirects
// Generado por scripts/generate-redirects.js

export const REDIRECTS_MAP = ${JSON.stringify(redirectsMap, null, 2)};

export function getRedirectPath(slug) {
  const category = REDIRECTS_MAP[slug];
  return category ? \`/\${category}/\${slug}\` : null;
}
`;

    const outputPath = path.join(process.cwd(), 'config/redirects.js');

    // Crear directorio config si no existe
    const configDir = path.dirname(outputPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, configContent);

    console.log('\n📝 Resumen:');
    console.log(`- Total artículos procesados: ${Object.keys(redirectsMap).length}`);
    console.log(`- Archivo generado: ${outputPath}`);
    console.log('\n🔄 Redirects configurados:');
    Object.entries(redirectsMap).forEach(([slug, category]) => {
      console.log(`  /${slug} -> /${category}/${slug}`);
    });

    return redirectsMap;

  } catch (error) {
    console.error('❌ Error generando redirects:', error);
    return null;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateRedirectsMapping();
}

module.exports = { generateRedirectsMapping };