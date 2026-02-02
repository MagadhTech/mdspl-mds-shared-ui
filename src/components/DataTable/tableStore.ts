import { Store } from '@tanstack/store';
import React from 'react';
import { getColumnOrderKey, getColumnVisibilityKey } from './DataTableActions';
import { ACTIONS_COLUMN_ID, Column, VISIBILITY_COLUMN_ID } from './types';

interface TableState {
  tableId: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  visibility: Record<string, boolean>;
  columnWidths: Record<string, number>;
  columnOrder: Column<any>[];
  data: any[];
  sortableColumns: {
    id: string;
    label: string | React.ReactNode;
    sortable: boolean;
    minWidth?: number | string;
  }[];
  enableColumnVisibility: boolean;
}

export const tableStore = new Store<TableState>({
  tableId: '',
  sortColumn: null,
  sortDirection: null,
  visibility: {},
  columnOrder: [],
  columnWidths: {},
  data: [],
  sortableColumns: [],
  enableColumnVisibility: true,
});

export const getColumnWidthKey = (tableId: string) => `datatable:${tableId}:column-widths`;

/* -------------------------------------------------- */
/* setData                                            */
/* -------------------------------------------------- */

export function setData(
  newData: any[],
  headers?: Column<any>[],
  enableColumnVisibility: boolean = true,
) {
  const firstRow = newData[0] ?? {};

  /* -------- normalize columns -------- */

  const baseColumns: Column<any>[] =
    headers && headers.length
      ? headers
      : Object.keys(firstRow).map((key) => ({
          id: key,
          label: key,
        }));

  const validColumns = baseColumns.filter(
    (col) => col.id === ACTIONS_COLUMN_ID || Object.prototype.hasOwnProperty.call(firstRow, col.id),
  );

  const { tableId } = tableStore.state;

  /* -------- column order -------- */

  const savedOrderIds: string[] = JSON.parse(
    localStorage.getItem(getColumnOrderKey(tableId)) || '[]',
  );

  let orderedColumns: Column<any>[] = [
    ...savedOrderIds.map((id) => validColumns.find((c) => c.id === id)).filter(Boolean),
    ...validColumns.filter((c) => !savedOrderIds.includes(c.id)),
  ] as Column<any>[];

  /* -------- inject visibility column (if enabled) -------- */

  if (enableColumnVisibility) {
    const hasVisibility = orderedColumns.some((c) => c.id === VISIBILITY_COLUMN_ID);

    if (!hasVisibility) {
      orderedColumns = [
        ...orderedColumns,
        {
          type: 'visibility',
          id: VISIBILITY_COLUMN_ID,
          label: '',
          minWidth: 50,
        } as Column<any>,
      ];
    }
  } else {
    orderedColumns = orderedColumns.filter((c) => c.id !== VISIBILITY_COLUMN_ID);
  }

  /* -------- visibility state -------- */

  const savedVisibility: Record<string, boolean> = JSON.parse(
    localStorage.getItem(getColumnVisibilityKey(tableId)) || '{}',
  );

  const visibility: Record<string, boolean> = {};

  if (enableColumnVisibility) {
    for (const col of orderedColumns) {
      if (col.id === VISIBILITY_COLUMN_ID || col.id === ACTIONS_COLUMN_ID) {
        visibility[col.id] = true;
      } else {
        visibility[col.id] = savedVisibility[col.id] ?? true;
      }
    }

    localStorage.setItem(getColumnVisibilityKey(tableId), JSON.stringify(visibility));
  }

  /* -------- column widths -------- */

  const savedWidths: Record<string, number> = JSON.parse(
    localStorage.getItem(getColumnWidthKey(tableId)) || '{}',
  );

  /* -------- commit state -------- */

  tableStore.setState((prev) => ({
    ...prev,
    data: newData,
    columnOrder: orderedColumns,
    visibility,
    columnWidths: savedWidths,
    enableColumnVisibility,
    sortableColumns: orderedColumns
      .filter((c) => c.id !== VISIBILITY_COLUMN_ID)
      .map((col) => ({
        id: col.id,
        label: col.label,
        sortable: col.id !== ACTIONS_COLUMN_ID,
        minWidth: col.minWidth,
      })),
  }));
}

/* -------------------------------------------------- */
/* setTableId                                         */
/* -------------------------------------------------- */

export function setTableId(tableId: string) {
  tableStore.setState((prev) => ({
    ...prev,
    tableId,
    sortColumn: null,
    sortDirection: 'asc',
  }));
}

/* -------------------------------------------------- */
/* column width                                       */
/* -------------------------------------------------- */

export function setColumnWidth(columnId: string, width: number) {
  tableStore.setState((prev) => {
    const min =
      typeof prev.columnOrder.find((c) => c.id === columnId)?.minWidth === 'number'
        ? (prev.columnOrder.find((c) => c.id === columnId)?.minWidth as number)
        : 120;

    const updated = {
      ...prev.columnWidths,
      [columnId]: Math.max(min, width),
    };

    localStorage.setItem(getColumnWidthKey(prev.tableId), JSON.stringify(updated));

    return { ...prev, columnWidths: updated };
  });
}
