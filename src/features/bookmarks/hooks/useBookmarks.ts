import { useBookmarksStore } from '../store/bookmarksStore';
import type { Article } from '@/shared/types/article';

interface UseBookmarksReturn {
  bookmarks: Article[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (article: Article) => void;
  removeBookmark: (id: number) => void;
}

/**
 * Thin selector wrapper over the bookmarks Zustand store.
 * Decouples feature screens from the store implementation detail.
 *
 * Note: `hydrateFromStorage` is called once in App.tsx on mount —
 * not inside this hook — to avoid re-reading AsyncStorage on every render.
 */
export function useBookmarks(): UseBookmarksReturn {
  const { bookmarks, isBookmarked, toggleBookmark, removeBookmark } =
    useBookmarksStore();

  return { bookmarks, isBookmarked, toggleBookmark, removeBookmark };
}
