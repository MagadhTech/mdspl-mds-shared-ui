import { Store } from '@tanstack/store';
import React from 'react';
import { getColumnOrderKey, getColumnVisibilityKey } from './DataTableActions';
import { ActionHeaderProps, Column } from './types';

interface TableState {
  tableId: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  visibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  columnOrder: Column[];
  data: any[];
  sortableColumns: {
    id: string;
    label: string | React.ReactNode;
    sortable: boolean;
    backgroundColor?: string;
    minWidth?: number | string;
  }[];
  actionsConfig?: ActionHeaderProps;
}

export const tableStore = new Store<TableState>({
  tableId: '',
  sortColumn: null,
  sortDirection: 'asc',
  visibility: {},
  columnOrder: [],
  columnWidths: {},
  data: [],
  sortableColumns: [],
  actionsConfig: {
    showActionColumn: true,
    showColumnVisibilityMenu: true,
    children: 'Actions',
    width: '100px',
  },
});
export const getColumnWidthKey = (tableId: string) => `datatable:${tableId}:column-widths`;

export function setData(newData: any[], headers?: Column[]) {
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

  const orderedColumns: Column[] = [
    ...savedOrderIds.map((id) => validColumns.find((c) => c.id === id)).filter(Boolean),
    ...validColumns.filter((col) => !savedOrderIds.includes(col.id)),
  ] as Column[];

  const savedVisibility: Record<string, boolean> = JSON.parse(
    localStorage.getItem(getColumnVisibilityKey(tableId)) || '{}',
  );

  const mergedVisibility = orderedColumns.reduce(
    (acc, col) => {
      acc[col.id] = savedVisibility[col.id] ?? true;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const savedWidths: Record<string, number> = JSON.parse(
    localStorage.getItem(getColumnWidthKey(tableId)) || '{}',
  );

  tableStore.setState((prev) => ({
    ...prev,
    data: newData,
    columnOrder: orderedColumns,
    visibility: mergedVisibility,
    columnWidths: savedWidths,
    sortableColumns: orderedColumns.map((col) => ({
      id: col.id,
      label: col.label,
      sortable: true,
      backgroundColor: col.backgroundColor,
      minWidth: col.minWidth,
    })),
  }));
}

export function setTableId(tableId: string) {
  tableStore.setState((prev) => ({
    ...prev,
    tableId,
    sortColumn: null,
    sortDirection: 'asc',
    columnOrder: [],
    visibility: {},
  }));
}

export const setActionsConfig = (actionsConfig: ActionHeaderProps) => {
  tableStore.setState((prev) => ({
    ...prev,
    actionsConfig,
  }));
};

export function setColumnWidth(columnId: string, width: number) {
  tableStore.setState((prev) => {
    const updated = {
      ...prev.columnWidths,
      [columnId]: Math.max(60, width), // min width
    };

    localStorage.setItem(getColumnWidthKey(prev.tableId), JSON.stringify(updated));

    return { ...prev, columnWidths: updated };
  });
}
