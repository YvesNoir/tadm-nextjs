const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const sharp = require('sharp');

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image-preview';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const ORIGINALS_DIR = path.join(process.cwd(), 'image-sources', 'ai-generated');
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const WATERMARK_LOGO = path.join(process.cwd(), 'public', 'images', 'tuasesordemoda-logo-white.png');
const MAX_IMAGES = 12;
const COVER_MAX_WIDTH = 1400;
const GALLERY_MAX_WIDTH = 900;
const WEBP_QUALITY = 78;
const WATERMARK_SCALE = 0.24;
const WATERMARK_OPACITY = 0.35;

function parseArgs(argv) {
  const args = {};

  for (let index = 2; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith('--')) {
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadPostContext(slug) {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);

  return {
    title: data.title || slug,
    excerpt: data.excerpt || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
    content: content.slice(0, 2000),
  };
}

function inferExtension(mimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/png':
    default:
      return 'png';
  }
}

function getOutputFileName(slug, mode, imageIndex) {
  return mode === 'cover'
    ? `${slug}-cover.webp`
    : `${slug}-gallery-${imageIndex}.webp`;
}

function getOriginalFileName(slug, mode, imageIndex, extension) {
  return mode === 'cover'
    ? `${slug}-cover-original.${extension}`
    : `${slug}-gallery-${imageIndex}-original.${extension}`;
}

async function createWatermarkBuffer(width) {
  const targetWidth = Math.max(180, Math.round(width * WATERMARK_SCALE));
  const { data, info } = await sharp(WATERMARK_LOGO)
    .resize({
      width: targetWidth,
      withoutEnlargement: true,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let index = 3; index < data.length; index += info.channels) {
    data[index] = Math.round(data[index] * WATERMARK_OPACITY);
  }

  return sharp(data, {
    raw: info,
  })
    .png()
    .toBuffer();
}

async function writeOptimizedImage({ imageData, outputPath, mode }) {
  const maxWidth = mode === 'cover' ? COVER_MAX_WIDTH : GALLERY_MAX_WIDTH;
  const source = sharp(Buffer.from(imageData, 'base64')).rotate();
  const metadata = await source.metadata();
  const resizedWidth = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width || maxWidth;
  const watermarkBuffer = await createWatermarkBuffer(resizedWidth);

  await sharp(Buffer.from(imageData, 'base64'))
    .rotate()
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
    })
    .composite([
      {
        input: watermarkBuffer,
        gravity: 'center',
      },
    ])
    .webp({
      quality: WEBP_QUALITY,
      effort: 5,
    })
    .toFile(outputPath);

  const outputSize = fs.statSync(outputPath).size;

  return {
    outputSize,
    width: resizedWidth,
  };
}

function buildPrompt({ title, excerpt, keywords, imageIndex, totalImages, mode }) {
  const keywordText = keywords.length > 0 ? keywords.join(', ') : 'moda, estilo, editorial';
  const imageRole = mode === 'cover'
    ? 'Crea una imagen de portada principal para un artículo editorial de moda.'
    : `Crea una imagen editorial para una galería de moda. Esta es la imagen ${imageIndex} de ${totalImages}.`;

  return [
    imageRole,
    `Tema del artículo: ${title}.`,
    excerpt ? `Contexto editorial: ${excerpt}.` : '',
    `Keywords objetivo: ${keywordText}.`,
    'Estilo visual: editorial de moda, fotografía realista, iluminación cuidada, lookbook premium, composición limpia.',
    'Evitar: texto incrustado, marcas de agua, tipografías, collage, manos deformes, proporciones irreales, baja resolución.',
    mode === 'cover'
      ? 'La imagen debe funcionar como hero image horizontal, con foco claro y estética aspiracional.'
      : 'La imagen debe aportar variedad visual útil para una galería y mostrar detalles de outfit, texturas, silueta o styling. Cuando tenga sentido, prioriza composiciones con 2 o 3 looks diferentes dentro de una misma escena o con más de una persona para mostrar variedad real sin perder coherencia editorial.',
  ]
    .filter(Boolean)
    .join(' ');
}

async function generateImage(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status} al generar imagen: ${errorText}`);
  }

  const payload = await response.json();
  const inlineParts = [];

  for (const candidate of payload.candidates || []) {
    for (const part of candidate?.content?.parts || []) {
      if (part.inlineData?.data) {
        inlineParts.push(part.inlineData);
      }
    }
  }

  if (inlineParts.length === 0) {
    throw new Error('La respuesta de Gemini no devolvió imágenes inlineData.');
  }

  return inlineParts[0];
}

async function main() {
  const args = parseArgs(process.argv);
  const slugInput = args.slug || args.article || args.title;

  if (!API_KEY) {
    throw new Error('Falta GEMINI_API_KEY. Agregala en .env.local o en las variables de entorno.');
  }

  if (!fs.existsSync(WATERMARK_LOGO)) {
    throw new Error(`Falta el logo de marca de agua en ${WATERMARK_LOGO}`);
  }

  if (!slugInput) {
    throw new Error('Debés pasar al menos --slug o --title.');
  }

  const slug = slugify(slugInput);
  const existingContext = loadPostContext(slug);
  const title = args.title || existingContext?.title || slug;
  const excerpt = args.excerpt || existingContext?.excerpt || '';
  const keywords = [
    ...(existingContext?.tags || []),
    ...String(args.keywords || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  ].filter((value, index, array) => array.indexOf(value) === index);

  const requestedCount = Number(args.count || 1);
  const count = Number.isFinite(requestedCount)
    ? Math.max(1, Math.min(requestedCount, MAX_IMAGES))
    : 1;
  const requestedStartIndex = Number(args['start-index'] || 1);
  const startIndex = Number.isFinite(requestedStartIndex)
    ? Math.max(1, requestedStartIndex)
    : 1;
  const mode = args.mode === 'gallery' ? 'gallery' : 'cover';
  const dryRun = Boolean(args['dry-run']);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(ORIGINALS_DIR, { recursive: true });

  const results = [];

  for (let offset = 0; offset < count; offset += 1) {
    const imageIndex = mode === 'cover' ? 1 : startIndex + offset;
    const prompt = buildPrompt({
      title,
      excerpt,
      keywords,
      imageIndex,
      totalImages: mode === 'cover' ? 1 : startIndex + count - 1,
      mode,
    });

    if (dryRun) {
      results.push({
        prompt,
        file: `/images/posts/${getOutputFileName(slug, mode, imageIndex)}`,
        maxWidth: mode === 'cover' ? COVER_MAX_WIDTH : GALLERY_MAX_WIDTH,
        format: 'webp',
      });
      continue;
    }

    const image = await generateImage(prompt);
    const originalExtension = inferExtension(image.mimeType);
    const originalFileName = getOriginalFileName(slug, mode, imageIndex, originalExtension);
    const originalOutputPath = path.join(ORIGINALS_DIR, originalFileName);
    fs.writeFileSync(originalOutputPath, Buffer.from(image.data, 'base64'));
    const fileName = getOutputFileName(slug, mode, imageIndex);
    const outputPath = path.join(OUTPUT_DIR, fileName);
    const optimized = await writeOptimizedImage({
      imageData: image.data,
      outputPath,
      mode,
    });

    results.push({
      prompt,
      mimeType: image.mimeType,
      finalFormat: 'image/webp',
      file: `/images/posts/${fileName}`,
      originalFile: path.relative(process.cwd(), originalOutputPath),
      outputPath,
      width: optimized.width,
      outputSize: optimized.outputSize,
    });
  }

  console.log(
    JSON.stringify(
      {
        slug,
        title,
        model: MODEL,
        mode,
        count,
        results,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
