import type { Column, DataTableRow } from '../components/DataTable/types';

export function formatDataTableRows<T extends Record<string, any>>(
  data: T[],
  columns: Column[],
  getRowKey?: (row: T, index: number) => string | number,
): DataTableRow<T>[] {
  return data.map((row, index) => {
    const cells: Record<string, React.ReactNode> = {};

    columns.forEach((col) => {
      cells[col.id] = formatCellValue(row[col.id]);
    });

    return {
      __key: getRowKey ? getRowKey(row, index) : (row.id ?? index),
      __raw: row,
      cells,
    };
  });
}

import React from 'react';

function formatCellValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) return '—';

  if (React.isValidElement(value)) return value;

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}
