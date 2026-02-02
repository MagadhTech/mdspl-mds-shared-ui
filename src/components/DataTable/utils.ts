import { Column } from './types';

export function sortRows<T>(
  rows: T[],
  column: Column<T> | undefined,
  direction: 'asc' | 'desc' | null,
): T[] {
  if (!column || !direction) return rows;

  // never sort these
  if (column.type === 'actions' || column.type === 'visibility') {
    return rows;
  }

  const getValue =
    'sortAccessor' in column && column.sortAccessor
      ? column.sortAccessor
      : (row: T) => (row as any)[column.id];

  const comparator =
    'sortComparator' in column && column.sortComparator
      ? column.sortComparator
      : (a: T, b: T, dir: 'asc' | 'desc') => {
          const aVal = getValue(a);
          const bVal = getValue(b);

          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return 1;
          if (bVal == null) return -1;

          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return dir === 'asc' ? aVal - bVal : bVal - aVal;
          }

          if (aVal instanceof Date && bVal instanceof Date) {
            return dir === 'asc'
              ? aVal.getTime() - bVal.getTime()
              : bVal.getTime() - aVal.getTime();
          }

          return dir === 'asc'
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        };

  return [...rows].sort((a, b) => comparator(a, b, direction));
}
