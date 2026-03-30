'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import React, { memo } from 'react';
import { tableStore } from './tableStore';
import { ACTIONS_COLUMN_ID, Column } from './types';

interface RowProps<T> {
  row: T;
  columns: Column<T>[];
  visibility: Record<string, boolean>;
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right' | 'both';
  index: number;
  height: number;
}

function RowComponent<T extends { id: string | number }>({
  row,
  columns,
  visibility,
  onRowSelect,
  onRowSelectEvent,
  index,
  height,
}: RowProps<T>) {
  const { columnWidths } = useStore(tableStore);
  return (
    <Table.Row
      data-index={index}
      onClick={(e) => {
        if (onRowSelectEvent === 'left' || onRowSelectEvent === 'both') {
          onRowSelect?.(row, e);
        }
      }}
      cursor={onRowSelect ? 'pointer' : 'default'}
      h={`${height}px`}
      _hover={{ bg: 'gray.50' }}
      onContextMenu={(e) => {
        if (onRowSelectEvent === 'right' || onRowSelectEvent === 'both') {
          e.preventDefault();
          onRowSelect?.(row, e);
        }
      }}
    >
      {columns.map((col) => {
        if (col.id !== ACTIONS_COLUMN_ID && visibility[col.id] === false) return null;

        return (
          <Table.Cell
            key={col.id}
            py={0}
            height={`${height}px`}
            width={`${columnWidths[col.id] ?? 20}px`}
            minWidth={col.minWidth ?? '20px'}
            maxWidth={`${columnWidths[col.id] ?? 180}px`}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {'render' in col && col.render ? (
              col.render(row)
            ) : (
              <div>{String((row as any)[col.id] ?? '')}</div>
            )}
          </Table.Cell>
        );
      })}
    </Table.Row>
  );
}

const MemoizedRow = memo(RowComponent) as typeof RowComponent;

export default function TableRows<T extends { id: string | number }>({
  data,
  columns,
  onRowSelect,
  onRowSelectEvent = 'left',
  rowHeight,
}: {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right' | 'both';
  rowHeight: number;
}) {
  const { visibility } = useStore(tableStore);

  return (
    <Table.Body>
      {data.map((row, index) => (
        <MemoizedRow
          key={row.id}
          index={index}
          row={row}
          columns={columns}
          visibility={visibility}
          onRowSelect={onRowSelect}
          onRowSelectEvent={onRowSelectEvent}
          height={rowHeight}
        />
      ))}
    </Table.Body>
  );
}
