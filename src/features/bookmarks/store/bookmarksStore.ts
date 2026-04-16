import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Article } from '@/shared/types/article';

const STORAGE_KEY = '@NewsFeedApp:bookmarks';

interface BookmarksState {
  bookmarks: Article[];
  /** True once AsyncStorage has been read on app start */
  hydrated: boolean;

  // Selectors
  isBookmarked: (id: number) => boolean;

  // Actions
  toggleBookmark: (article: Article) => void;
  removeBookmark: (id: number) => void;
  hydrateFromStorage: () => Promise<void>;
}

/**
 * Persists the current bookmarks array to AsyncStorage.
 * Called internally after every mutation.
 */
async function persistBookmarks(bookmarks: Article[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // Persistence failure is non-fatal — the in-memory state is still correct
  }
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  bookmarks: [],
  hydrated: false,

  isBookmarked: (id: number): boolean =>
    get().bookmarks.some(b => b.id === id),

  toggleBookmark: (article: Article): void => {
    const existing = get().bookmarks;
    const alreadySaved = existing.some(b => b.id === article.id);
    const updated = alreadySaved
      ? existing.filter(b => b.id !== article.id)
      : [...existing, article];
    set({ bookmarks: updated });
    persistBookmarks(updated);
  },

  removeBookmark: (id: number): void => {
    const updated = get().bookmarks.filter(b => b.id !== id);
    set({ bookmarks: updated });
    persistBookmarks(updated);
  },

  hydrateFromStorage: async (): Promise<void> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Article[] = JSON.parse(raw);
        set({ bookmarks: parsed, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true }); // Mark hydrated even on error — don't block the app
    }
  },
}));
