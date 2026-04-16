import { useEffect, useState } from 'react';

/**
 * Generic debounce hook.
 * Returns a debounced version of {@link value} that only updates after
 * {@link delay} ms of inactivity. Used for the search input to prevent
 * filtering on every keystroke.
 *
 * @example
 * const debouncedQuery = useDebounce(searchQuery, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
