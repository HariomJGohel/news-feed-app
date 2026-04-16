import { create } from 'zustand';
import type { Article, FetchStatus, SortOrder } from '@/shared/types/article';
import { fetchTopArticles } from '@/shared/api/hackerNews';

interface ArticlesState {
  articles: Article[];
  status: FetchStatus;
  error: string | null;
  sortOrder: SortOrder;
  /** Tracks the first visible FlatList item index for scroll restoration */
  scrollIndex: number;
  searchQuery: string;

  // Actions
  fetchArticles: () => Promise<void>;
  refreshArticles: () => Promise<void>;
  setSortOrder: (order: SortOrder) => void;
  setScrollIndex: (index: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useArticlesStore = create<ArticlesState>((set, get) => ({
  articles: [],
  status: 'idle',
  error: null,
  sortOrder: 'score',
  scrollIndex: 0,
  searchQuery: '',

  fetchArticles: async () => {
    if (get().status === 'loading') {
      return; // Prevent duplicate concurrent requests
    }
    set({ status: 'loading', error: null });
    try {
      const articles = await fetchTopArticles();
      set({ articles, status: 'success' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load stories';
      set({ status: 'error', error: message });
    }
  },

  refreshArticles: async () => {
    set({ status: 'refreshing', error: null });
    try {
      const articles = await fetchTopArticles();
      set({ articles, status: 'success' });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to refresh stories';
      set({ status: 'error', error: message });
    }
  },

  setSortOrder: order => set({ sortOrder: order }),
  setScrollIndex: index => set({ scrollIndex: index }),
  setSearchQuery: query => set({ searchQuery: query }),
}));
