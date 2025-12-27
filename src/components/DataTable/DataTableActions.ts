import { tableStore } from './tableStore';
import { Column } from './types';

export const getColumnOrderKey = (tableId: string) => `table_column_order_v1:${tableId}`;

export const setColumnOrder = (order: Column<any>[]) => {
  const { tableId } = tableStore.state;
  localStorage.setItem(getColumnOrderKey(tableId), JSON.stringify(order.map((c) => c.id)));

  tableStore.setState((s) => ({
    ...s,
    columnOrder: order,
  }));
  tableStore.setState((s) => ({ ...s, columnOrder: order }));
};

export const toggleColumn = (id: string) => {
  tableStore.setState((s) => ({
    ...s,
    visibility: { ...s.visibility, [id]: !s.visibility[id] },
  }));
};

export function sortByColumn(columnId: string) {
  tableStore.setState((s) => {
    if (s.sortColumn === columnId) {
      return {
        ...s,
        sortDirection: s.sortDirection === 'asc' ? 'desc' : 'asc',
      };
    }

    return {
      ...s,
      sortColumn: columnId,
      sortDirection: 'asc',
    };
  });
}
