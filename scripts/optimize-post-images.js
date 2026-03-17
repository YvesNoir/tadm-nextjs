const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'posts');
const WATERMARK_LOGO = path.join(process.cwd(), 'public', 'images', 'tuasesordemoda-logo-white.png');
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

async function optimizeImage(inputPath, outputPath, mode) {
  const maxWidth = mode === 'cover' ? COVER_MAX_WIDTH : GALLERY_MAX_WIDTH;
  const source = sharp(inputPath).rotate();
  const metadata = await source.metadata();
  const resizedWidth = metadata.width && metadata.width > maxWidth ? maxWidth : metadata.width || maxWidth;
  const watermarkBuffer = await createWatermarkBuffer(resizedWidth);
  const writingInPlace = inputPath === outputPath;
  const finalOutputPath = writingInPlace ? `${outputPath}.tmp.webp` : outputPath;

  await sharp(inputPath)
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
    .toFile(finalOutputPath);

  if (writingInPlace) {
    fs.renameSync(finalOutputPath, outputPath);
  }

  return {
    width: resizedWidth,
    outputSize: fs.statSync(outputPath).size,
  };
}

function collectImageMatches(content, slug) {
  const pattern = new RegExp(`/images/posts/${escapeRegExp(slug)}-(cover|gallery-\\d+)\\.(png|jpg|jpeg|webp)`, 'g');
  const matches = [];

  for (const match of content.matchAll(pattern)) {
    matches.push(match[0]);
  }

  return [...new Set(matches)];
}

function resolvePreferredSourcePath(imageRef) {
  const currentPath = path.join(process.cwd(), 'public', imageRef.replace('/images/', 'images/'));
  const parsed = path.parse(currentPath);
  const preferredExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

  for (const extension of preferredExtensions) {
    const candidate = path.join(parsed.dir, `${parsed.name}${extension}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return currentPath;
}

async function main() {
  const args = parseArgs(process.argv);
  const slug = args.slug;

  if (!slug) {
    throw new Error('Debés pasar --slug.');
  }

  if (!fs.existsSync(WATERMARK_LOGO)) {
    throw new Error(`Falta el logo de marca de agua en ${WATERMARK_LOGO}`);
  }

  const postPath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(postPath)) {
    throw new Error(`No existe el post ${postPath}`);
  }

  let postContent = fs.readFileSync(postPath, 'utf8');
  const imageRefs = collectImageMatches(postContent, slug);

  if (imageRefs.length === 0) {
    console.log(JSON.stringify({ slug, optimized: 0, images: [] }, null, 2));
    return;
  }

  const results = [];

  for (const imageRef of imageRefs) {
    const sourcePath = resolvePreferredSourcePath(imageRef);
    const fileName = path.basename(sourcePath);
    const mode = fileName.includes('-cover.') ? 'cover' : 'gallery';
    const targetRef = imageRef.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(process.cwd(), 'public', targetRef.replace('/images/', 'images/'));

    if (!fs.existsSync(sourcePath)) {
      results.push({
        source: imageRef,
        missing: true,
      });
      continue;
    }

    const optimized = await optimizeImage(sourcePath, outputPath, mode);
    postContent = postContent.split(imageRef).join(targetRef);

    results.push({
      source: imageRef,
      target: targetRef,
      width: optimized.width,
      outputSize: optimized.outputSize,
    });
  }

  fs.writeFileSync(postPath, postContent);

  console.log(
    JSON.stringify(
      {
        slug,
        optimized: results.filter((item) => !item.missing).length,
        images: results,
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
