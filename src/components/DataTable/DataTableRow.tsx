'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { tableStore } from './tableStore';
import { ACTIONS_COLUMN_ID, Column, VISIBILITY_COLUMN_ID } from './types';

export default function TableRows<T extends { id: string | number }>({
  data,
  columns,
  onRowSelect,
  onRowSelectEvent = 'left',
}: {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right';
}) {
  const { visibility } = useStore(tableStore);

  return (
    <Table.Body>
      {data.map((row) => (
        <Table.Row
          key={row.id}
          onClick={(e) => onRowSelectEvent === 'left' && onRowSelect?.(row, e)}
        >
          {columns
            .filter((col) => {
              if (col.id === VISIBILITY_COLUMN_ID) return false;

              if (col.id === ACTIONS_COLUMN_ID) return true;

              return visibility[col.id] !== false;
            })
            .map((col) => (
              <Table.Cell key={col.id}>
                {'render' in col && col.render
                  ? col.render(row)
                  : String((row as any)[col.id] ?? '—')}
              </Table.Cell>
            ))}
        </Table.Row>
      ))}
    </Table.Body>
  );
}
