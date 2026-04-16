/**
 * All Hacker News API path strings.
 * BASE_URL lives in client.ts — this file is intentionally URL-agnostic.
 */
export const Endpoints = {
  /** Returns an array of integer story IDs (up to 500). */
  topStories: '/topstories.json',
  /** Returns a single HNItem by ID. */
  item: (id: number): string => `/item/${id}.json`,
} as const;
