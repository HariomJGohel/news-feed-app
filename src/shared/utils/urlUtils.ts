/**
 * Extracts the hostname from a URL string.
 * Returns 'unknown' on parse failure — never throws.
 *
 * @example extractDomain('https://github.com/facebook/react') → 'github.com'
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Returns the Google S2 favicon URL for a given domain.
 * Falls back gracefully if the domain is 'unknown'.
 *
 * @example getFaviconUrl('github.com') → 'https://www.google.com/s2/favicons?domain=github.com&sz=64'
 */
export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}
