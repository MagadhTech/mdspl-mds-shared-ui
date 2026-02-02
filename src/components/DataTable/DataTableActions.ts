import { getColumnWidthKey, tableStore } from './tableStore';
import { Column } from './types';

export const getColumnOrderKey = (tableId: string) => `table_column_order_v1:${tableId}`;
export const getColumnVisibilityKey = (tableId: string) => `table_column_visibility_v1:${tableId}`;

export const setColumnOrder = (order: Column<any>[]) => {
  const { tableId } = tableStore.state;
  localStorage.setItem(getColumnOrderKey(tableId), JSON.stringify(order.map((c) => c.id)));

  tableStore.setState((s) => ({
    ...s,
    columnOrder: order,
  }));
  tableStore.setState((s) => ({ ...s, columnOrder: order }));
};

export function sortByColumn(columnId: string) {
  tableStore.setState((s) => {
    if (s.sortColumn === columnId) {
      if (s.sortDirection === 'asc') {
        return { ...s, sortDirection: 'desc' };
      }
      if (s.sortDirection === 'desc') {
        return { ...s, sortColumn: null, sortDirection: null };
      }
    }

    return {
      ...s,
      sortColumn: columnId,
      sortDirection: 'asc',
    };
  });
}

export const toggleColumn = (id: string) => {
  tableStore.setState((s) => {
    const nextVisibility = {
      ...s.visibility,
      [id]: !s.visibility[id],
    };

    if (s.tableId) {
      localStorage.setItem(getColumnVisibilityKey(s.tableId), JSON.stringify(nextVisibility));
    }

    return {
      ...s,
      visibility: nextVisibility,
    };
  });
};

export const loadColumnVisibility = (tableId: string) => {
  if (!tableId) return;

  const raw = localStorage.getItem(getColumnVisibilityKey(tableId));
  if (!raw) return;

  try {
    const visibility = JSON.parse(raw);

    tableStore.setState((s) => ({
      ...s,
      visibility,
    }));
  } catch {}
};

export const resetColumnVisibility = () => {
  tableStore.setState((s) => {
    if (s.tableId) {
      localStorage.removeItem(getColumnVisibilityKey(s.tableId));
    }

    return {
      ...s,
      visibility: {},
    };
  });
};

interface GetVisibleOrderedColumnsArgs {
  columnOrder: Column<any>[];
  sortableColumns: {
    id: string;
    label: string;
    sortable: boolean;
    backgroundColor?: string;
  }[];
  visibility: Record<string, boolean>;
}

export function getVisibleOrderedColumns({
  columnOrder,
  sortableColumns,
  visibility,
}: GetVisibleOrderedColumnsArgs) {
  return columnOrder
    .map((orderCol) => sortableColumns.find((c) => c.id === orderCol.id))
    .filter((col): col is NonNullable<typeof col> => Boolean(col))
    .filter((col) => visibility[col.id]);
}

export function setColumnWidth(columnId: string, width: number) {
  tableStore.setState((prev) => {
    const col = prev.columnOrder.find((c) => c.id === columnId);
    const min = typeof col?.minWidth === 'number' ? col.minWidth : 120;

    const updated = {
      ...prev.columnWidths,
      [columnId]: Math.max(min, width),
    };

    localStorage.setItem(getColumnWidthKey(prev.tableId), JSON.stringify(updated));

    return { ...prev, columnWidths: updated };
  });
}
