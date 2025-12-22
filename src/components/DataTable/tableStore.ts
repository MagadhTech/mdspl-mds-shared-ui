import { Store } from '@tanstack/store';
import { Column } from './types';

interface TableState {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  visibility: Record<string, boolean>;
  columnOrder: Column<any>[]; // ← FIXED
  data: any[];
  sortableColumns: {
    // ← FIXED SPELLING
    id: string;
    label: string;
    sortable: boolean;
  }[];
}

export const tableStore = new Store<TableState>({
  sortColumn: null,
  sortDirection: 'asc',
  visibility: {},
  columnOrder: [],
  data: [],
  sortableColumns: [], // ← FIXED
});

export function setData(newData: any[], headers?: Column<any>[]) {
  const firstRow = newData[0] ?? {};
  const dynamicColumns =
    headers && headers.length
      ? headers
      : Object.keys(firstRow).map((key) => ({ id: key, label: key }));

  const validColumns = dynamicColumns.filter((col) => firstRow.hasOwnProperty(col.id));
  tableStore.setState((prev) => ({
    ...prev,
    data: newData,
    columnOrder: validColumns,

    visibility: validColumns.reduce(
      (acc, col) => ({
        ...acc,
        [col.id]: true,
      }),
      {},
    ),

    sortableColumns: validColumns.map((col) => ({
      id: col.id,
      label: col.label,
      sortable: true,
    })),
  }));
}
