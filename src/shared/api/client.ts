import axios from 'axios';

/**
 * Single source of truth for the Hacker News base URL.
 * All API requests go through this Axios instance.
 */
const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
});

/**
 * Generic typed GET helper.
 * Keeps service files clean — they call apiGet<T> and get back T, never
 * have to reach into response.data themselves.
 *
 * @param path - relative path, e.g. '/topstories.json'
 */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await apiClient.get<T>(path);
  console.log("🚀 ~ apiGet ~ response:", response)
  return response.data;
}
