/**
 * Raw shape returned by the Hacker News Firebase API.
 * All fields optional because the API may omit any of them.
 */
export interface HNItem {
  id: number;
  title?: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
  type?: string;
  kids?: number[];
  descendants?: number;
}

/**
 * Mapped domain model — every field guaranteed present after filtering.
 */
export interface Article {
  id: number;
  title: string;
  url: string;
  /** Extracted hostname, e.g. "github.com" */
  domain: string;
  /** Google S2 favicon URL */
  faviconUrl: string;
  author: string;
  score: number;
  /** Unix timestamp (seconds) */
  time: number;
}

/** Controls which field the article list is sorted by. */
export type SortOrder = 'score' | 'time';

/** Finite-state-machine for async data fetching. */
export type FetchStatus = 'idle' | 'loading' | 'refreshing' | 'error' | 'success';
