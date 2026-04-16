/**
 * Business logic unit test — dateUtils.formatRelativeTime
 *
 * This is a pure function test: no mocks, no component rendering.
 * Tests the relative-time formatting logic across the full range of outputs.
 */
import { formatRelativeTime } from '../src/shared/utils/dateUtils';

const nowSeconds = () => Math.floor(Date.now() / 1000);

describe('formatRelativeTime', () => {
  it('returns "just now" for timestamps less than 60 seconds ago', () => {
    expect(formatRelativeTime(nowSeconds() - 30)).toBe('just now');
    expect(formatRelativeTime(nowSeconds() - 0)).toBe('just now');
  });

  it('returns minutes for timestamps 1–59 minutes ago', () => {
    expect(formatRelativeTime(nowSeconds() - 60)).toBe('1m ago');
    expect(formatRelativeTime(nowSeconds() - 120)).toBe('2m ago');
    expect(formatRelativeTime(nowSeconds() - 59 * 60)).toBe('59m ago');
  });

  it('returns hours for timestamps 1–23 hours ago', () => {
    expect(formatRelativeTime(nowSeconds() - 3600)).toBe('1h ago');
    expect(formatRelativeTime(nowSeconds() - 7200)).toBe('2h ago');
    expect(formatRelativeTime(nowSeconds() - 23 * 3600)).toBe('23h ago');
  });

  it('returns days for timestamps 1–6 days ago', () => {
    expect(formatRelativeTime(nowSeconds() - 86400)).toBe('1d ago');
    expect(formatRelativeTime(nowSeconds() - 3 * 86400)).toBe('3d ago');
    expect(formatRelativeTime(nowSeconds() - 6 * 86400)).toBe('6d ago');
  });

  it('returns a short date for timestamps 7+ days ago', () => {
    const result = formatRelativeTime(nowSeconds() - 8 * 86400);
    // Should be something like "Apr 8" — not a relative string
    expect(result).toMatch(/^[A-Z][a-z]{2} \d+$/);
  });
});
