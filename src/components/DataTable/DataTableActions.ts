import { tableStore } from './tableStore';
import { Column } from './types';

export const setColumnOrder = (order: Column<any>[]) => {
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
