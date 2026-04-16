import { apiGet } from './client';
import { Endpoints } from './endpoints';
import type { HNItem, Article } from '@/shared/types/article';
import { extractDomain, getFaviconUrl } from '@/shared/utils/urlUtils';

const TOP_STORIES_LIMIT = 20;

/**
 * Fetches the first {@link TOP_STORIES_LIMIT} top story IDs.
 */
async function fetchTopStoryIds(): Promise<number[]> {
  const ids = await apiGet<number[]>(Endpoints.topStories);
  return ids.slice(0, TOP_STORIES_LIMIT);
}

/**
 * Fetches a single Hacker News item by ID.
 */
async function fetchItem(id: number): Promise<HNItem> {
  return apiGet<HNItem>(Endpoints.item(id));
}

/**
 * Fetches the top 20 HN stories in parallel, filters to items that are
 * of type 'story' and have a URL, then maps to our domain {@link Article} model.
 *
 * Uses Promise.all — all 20 requests fire simultaneously. If any single
 * request fails the whole batch rejects (caught in the Zustand store and
 * surfaced as an error state).
 */
export async function fetchTopArticles(): Promise<Article[]> {
  const ids = await fetchTopStoryIds();
  const items = await Promise.all(ids.map(fetchItem));

  return items
    .filter(
      (item): item is Required<Pick<HNItem, 'id' | 'title' | 'url' | 'by' | 'score' | 'time'>> & HNItem =>
        item.type === 'story' &&
        typeof item.url === 'string' &&
        item.url.length > 0 &&
        typeof item.title === 'string' &&
        typeof item.by === 'string' &&
        typeof item.score === 'number' &&
        typeof item.time === 'number',
    )
    .map(item => {
      const domain = extractDomain(item.url);
      return {
        id: item.id,
        title: item.title,
        url: item.url,
        domain,
        faviconUrl: getFaviconUrl(domain),
        author: item.by,
        score: item.score,
        time: item.time,
      };
    });
}
