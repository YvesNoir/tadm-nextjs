import { getAllCategories } from './categories'
import { getAllPosts, getPostPath } from './posts'

const BASE_URL = 'https://www.tuasesordemoda.com'
const SITE_TITLE = 'Tu Asesor de Moda'
const SITE_DESCRIPTION =
  'Blog editorial de moda, estilo y belleza para mujer y hombre con guías prácticas, outfits, tendencias y recomendaciones para vestir mejor.'

type LlmsArticle = {
  title: string
  url: string
  description: string
}

function sanitizeText(value: string | undefined): string {
  return String(value || '')
    .replace(/Leer más\s*»?/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateText(value: string, maxLength: number = 220): string {
  if (value.length <= maxLength) {
    return value
  }

  const truncated = value.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`
}

function getCategoryLines(): string[] {
  const preferredOrder = ['mujer', 'hombre', 'belleza', 'recomendaciones', 'moda', 'zapatos', 'perfumes']
  const categories = getAllCategories()
    .filter((category) => preferredOrder.includes(category.slug))
    .sort((left, right) => preferredOrder.indexOf(left.slug) - preferredOrder.indexOf(right.slug))

  return categories.map((category) => {
    const description = sanitizeText(category.seoDescription || category.description)
    return `- [${category.name}](${BASE_URL}/${category.slug}): ${description}`
  })
}

function getArticleEntries(limit: number): LlmsArticle[] {
  return getAllPosts()
    .filter((post) => post.status === 'published' && sanitizeText(post.seoDescription))
    .slice(0, limit)
    .map((post) => ({
      title: sanitizeText(post.title),
      url: `${BASE_URL}${getPostPath(post.slug)}`,
      description: truncateText(sanitizeText(post.seoDescription)),
    }))
    .filter((post) => post.title && post.description)
}

function renderArticles(articles: LlmsArticle[]): string[] {
  return articles.map((article) => `- [${article.title}](${article.url}): ${article.description}`)
}

export function buildLlmsTxt(): string {
  const lines = [
    `# ${SITE_TITLE}`,
    `> ${SITE_DESCRIPTION}`,
    '',
    '## Main Pages',
    `- [Inicio](${BASE_URL}): Moda, estilo y belleza para descubrir ideas útiles para mujer y hombre.`,
    `- [Blog](${BASE_URL}/blog): Archivo editorial completo con artículos de moda, belleza, outfits y recomendaciones.`,
    ...getCategoryLines(),
    '',
    '## Featured Articles',
    ...renderArticles(getArticleEntries(12)),
    '',
    '## Extended Version',
    `- [llms-full.txt](${BASE_URL}/llms-full.txt): versión ampliada con más artículos y contexto editorial del sitio.`,
    '',
  ]

  return `${lines.join('\n')}\n`
}

export function buildLlmsFullTxt(): string {
  const lines = [
    `# ${SITE_TITLE}`,
    `> ${SITE_DESCRIPTION}`,
    '',
    '## Main Pages',
    `- [Inicio](${BASE_URL}): Moda, estilo y belleza para descubrir ideas útiles para mujer y hombre.`,
    `- [Blog](${BASE_URL}/blog): Archivo editorial completo con artículos de moda, belleza, outfits y recomendaciones.`,
    ...getCategoryLines(),
    '',
    '## Recent Articles',
    ...renderArticles(getArticleEntries(18)),
    '',
  ]

  return `${lines.join('\n')}\n`
}
