import { Store } from '@tanstack/store';

interface TableState {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  visibility: Record<string, boolean>;
  columnOrder: string[];
  data: any[]; // <<< ADD THIS
  sortebleColumns: {
    id: string;
    label: string;
    sortable: boolean;
  }[];
}

export const tableStore = new Store<TableState>({
  sortColumn: null,
  sortDirection: 'asc',
  visibility: {}, // initially empty
  columnOrder: [], // initially empty
  data: [],
  sortebleColumns: [],
});

export function setData(newData: any[]) {
  tableStore.setState((prev) => {
    const firstRow = newData[0] ?? {};
    const dynamicColumns = Object.keys(firstRow);
    return {
      ...prev,
      data: newData,
      columnOrder: dynamicColumns,
      visibility: dynamicColumns.reduce((acc, id) => ({ ...acc, [id]: true }), {}),
      sortebleColumns: dynamicColumns.map((id) => ({
        id,
        label: id,
        sortable: true,
      })),
    };
  });
}
