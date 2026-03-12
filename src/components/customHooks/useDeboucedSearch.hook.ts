import { useCallback, useEffect, useState } from 'react';

export interface UseDebouncedSearchOptions {
  initialValue?: string;
  delay?: number;
  len?: number;
}

interface UseDebouncedSearchResult {
  search: string;
  debouncedSearch: string;
  onSearchChange: (value: string) => void;
  reset: () => void;
  len: number;
}

export default function useDebouncedSearch(
  options: UseDebouncedSearchOptions = {},
): UseDebouncedSearchResult {
  const { initialValue = '', delay = 300, len = 3 } = options;

  const [search, setSearch] = useState(initialValue);

  // If the search is empty (user cleared it) OR it meets the length requirement,
  // we pass the actual string. Otherwise, we pass an empty string.
  const isValidLength = search.length === 0 || search.length >= len;
  const valueToDebounce = isValidLength ? search : '';

  const debouncedSearch = useDebouncedValue(valueToDebounce, delay);

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const reset = useCallback(() => {
    setSearch(initialValue);
  }, [initialValue]);

  return {
    search,
    debouncedSearch,
    onSearchChange,
    reset,
    len,
  };
}

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
