import { load } from 'cheerio';

type ArticleBlock =
  | { type: 'content'; html: string }
  | { type: 'ad'; key: string };

function getWordCountFromHtml(content: string): number {
  const text = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > 0 ? text.split(' ').length : 0;
}

export function buildArticleBlocks(content: string): { blocks: ArticleBlock[]; showBottomAd: boolean } {
  const $ = load(`<div id="article-root">${content}</div>`);
  const root = $('#article-root');
  const children = root.contents().toArray();
  const h2Count = root.find('h2').length;
  const wordCount = getWordCountFromHtml(content);

  const adBreaks: number[] = [];

  if (h2Count >= 3 && wordCount >= 700) {
    adBreaks.push(2);
  }

  if (h2Count >= 6 && wordCount >= 1300) {
    adBreaks.push(4);
  }

  const blocks: ArticleBlock[] = [];
  let currentHtml = '';
  let seenH2 = 0;

  for (const child of children) {
    const html = $.html(child) || '';
    currentHtml += html;

    if (child.type === 'tag' && child.tagName === 'h2') {
      seenH2 += 1;

      if (adBreaks.includes(seenH2)) {
        if (currentHtml.trim()) {
          blocks.push({ type: 'content', html: currentHtml });
        }
        blocks.push({ type: 'ad', key: `inline-${seenH2}` });
        currentHtml = '';
      }
    }
  }

  if (currentHtml.trim()) {
    blocks.push({ type: 'content', html: currentHtml });
  }

  return {
    blocks,
    showBottomAd: wordCount >= 1100,
  };
}
