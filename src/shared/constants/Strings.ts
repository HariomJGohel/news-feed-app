/**
 * Strings — single source of truth for all user-facing static text.
 *
 * Organized by feature/screen. If the app is ever localized, this file
 * becomes the base en_US translation object.
 */

export const Strings = {
  // ─── App / Header ────────────────────────────────────────────────
  appName: 'HackerNews',
  appNameHighlight: 'Hacker',
  appNameSuffix: 'News',

  // ─── Sort chips (Article List) ───────────────────────────────────
  sortByScore: 'Top',
  sortByTime: 'New',

  // ─── Search ──────────────────────────────────────────────────────
  searchPlaceholder: 'Search stories...',
  searchNoResults: (query: string) => `No results for "${query}"`,
  searchNoStories: 'No stories found. Pull down to refresh.',

  // ─── Article List / Error ────────────────────────────────────────
  errorFallback: 'Something went wrong',

  // ─── Article Detail ──────────────────────────────────────────────
  detailHeaderTitle: 'Article',
  detailArticleNotFound: 'Article not found',
  detailSectionOriginalSource: 'Original Source',
  detailSectionDetails: 'Details',
  detailLabelUpvotes: 'Upvotes',
  detailLabelPostedBy: 'Posted by',
  detailLabelPosted: 'Posted',
  detailErrorOpenLink: 'Failed to open link',
  detailErrorTitle: 'Error',

  // ─── Article Card ────────────────────────────────────────────────
  cardAuthorPrefix: 'by',

  // ─── Bookmarks ───────────────────────────────────────────────────
  bookmarkRemoveTitle: 'Remove Bookmark',
  bookmarkRemoveMessage: (title: string) =>
    `Are you sure you want to remove "${title}" from your bookmarks?`,
  bookmarkRemoveCancel: 'Cancel',
  bookmarkRemoveConfirm: 'Remove',
  bookmarkEmptyMessage: 'No bookmarks yet. Tap the bookmark icon on any article to save it.',
  bookmarkSavedSingular: 'saved article',
  bookmarkSavedPlural: 'saved articles',

  // ─── Error / Empty / Retry ───────────────────────────────────────
  retryButton: 'Try Again',
  emptyDefault: 'Nothing here yet',

  // ─── Offline Banner ──────────────────────────────────────────────
  offlineMessage: 'No internet connection',
};
