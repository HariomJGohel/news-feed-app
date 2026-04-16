/**
 * Converts a Unix timestamp (seconds) to a human-readable relative time string.
 * Pure function — no side effects, easily unit-tested.
 *
 * @example
 * formatRelativeTime(Date.now() / 1000 - 90)   → '1m ago'
 * formatRelativeTime(Date.now() / 1000 - 7200)  → '2h ago'
 * formatRelativeTime(Date.now() / 1000 - 86400) → '1d ago'
 */
export function formatRelativeTime(unixTimestamp: number): string {
  const nowSeconds = Date.now() / 1000;
  const diffSeconds = Math.floor(nowSeconds - unixTimestamp);

  if (diffSeconds < 60) {
    return 'just now';
  }

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  // For older articles show a readable date
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
