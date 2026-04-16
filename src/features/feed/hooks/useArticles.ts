import { useEffect, useMemo } from 'react';
import { useArticlesStore } from '../store/articlesStore';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { Article, FetchStatus, SortOrder } from '@/shared/types/article';

interface UseArticlesReturn {
  displayedArticles: Article[];
  status: FetchStatus;
  error: string | null;
  sortOrder: SortOrder;
  scrollIndex: number;
  searchQuery: string;
  fetchArticles: () => Promise<void>;
  refreshArticles: () => Promise<void>;
  setSortOrder: (order: SortOrder) => void;
  setScrollIndex: (index: number) => void;
  setSearchQuery: (query: string) => void;
}

/**
 * Orchestrates data fetching and client-side sort/filter for the feed feature.
 *
 * - Triggers a fetch on mount only if status is 'idle' (prevents re-fetch on
 *   navigate-back while preserving manual refresh capability).
 * - Returns memoised `displayedArticles` — sorted by score or time, then
 *   filtered by the debounced search query (no extra API calls).
 */
export function useArticles(): UseArticlesReturn {
  const {
    articles,
    status,
    error,
    sortOrder,
    scrollIndex,
    searchQuery,
    fetchArticles,
    refreshArticles,
    setSortOrder,
    setScrollIndex,
    setSearchQuery,
  } = useArticlesStore();

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (status === 'idle') {
      fetchArticles();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentional: run once on mount only

  const displayedArticles = useMemo(() => {
    let result = [...articles];

    // Apply debounced search filter — zero API calls
    if (debouncedQuery.trim().length > 0) {
      const query = debouncedQuery.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(query) ||
          a.domain.toLowerCase().includes(query),
      );
    }

    // Sort by selected order
    if (sortOrder === 'score') {
      result.sort((a, b) => b.score - a.score);
    } else {
      result.sort((a, b) => b.time - a.time);
    }

    return result;
  }, [articles, debouncedQuery, sortOrder]);

  return {
    displayedArticles,
    status,
    error,
    sortOrder,
    scrollIndex,
    searchQuery,
    fetchArticles,
    refreshArticles,
    setSortOrder,
    setScrollIndex,
    setSearchQuery,
  };
}
