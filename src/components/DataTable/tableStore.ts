import { Store } from '@tanstack/store';
// import { COLUMN_ORDER_KEY } from './DataTableActions';
import { getColumnOrderKey } from './DataTableActions';
import { Column } from './types';

interface TableState {
  tableId: string;
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
  tableId: '',
  sortColumn: null,
  sortDirection: 'asc',
  visibility: {},
  columnOrder: [],
  data: [],
  sortableColumns: [], // ← FIXED
});

// export function setData(newData: any[], headers?: Column<any>[]) {
//   const firstRow = newData[0] ?? {};
//   const dynamicColumns =
//     headers && headers.length
//       ? headers
//       : Object.keys(firstRow).map((key) => ({ id: key, label: key }));

//   const validColumns = dynamicColumns.filter((col) => firstRow.hasOwnProperty(col.id));
//   tableStore.setState((prev) => ({
//     ...prev,
//     data: newData,
//     columnOrder: validColumns,

//     visibility: validColumns.reduce(
//       (acc, col) => ({
//         ...acc,
//         [col.id]: true,
//       }),
//       {},
//     ),

//     sortableColumns: validColumns.map((col) => ({
//       id: col.id,
//       label: col.label,
//       sortable: true,
//     })),
//   }));
// }

export function setData(newData: any[], headers?: Column<any>[]) {
  const firstRow = newData[0] ?? {};

  const dynamicColumns =
    headers && headers.length
      ? headers
      : Object.keys(firstRow).map((key) => ({ id: key, label: key }));

  const validColumns = dynamicColumns.filter((col) =>
    Object.prototype.hasOwnProperty.call(firstRow, col.id),
  );

  const { tableId } = tableStore.state;
  const savedOrderIds: string[] = JSON.parse(
    localStorage.getItem(getColumnOrderKey(tableId)) || '[]',
  );

  const orderedColumns: Column<any>[] = [
    ...savedOrderIds.map((id) => validColumns.find((c) => c.id === id)).filter(Boolean),
    ...validColumns.filter((col) => !savedOrderIds.includes(col.id)),
  ] as Column<any>[];

  tableStore.setState((prev) => ({
    ...prev,
    data: newData,
    columnOrder: orderedColumns,

    visibility: orderedColumns.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {} as Record<string, boolean>),

    sortableColumns: orderedColumns.map((col) => ({
      id: col.id,
      label: col.label,
      sortable: true,
    })),
  }));
}

export function setTableId(tableId: string) {
  tableStore.setState((prev) => ({
    ...prev,
    tableId,
  }));
}
