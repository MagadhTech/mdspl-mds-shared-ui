'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { Virtualizer } from '@tanstack/react-virtual';
import React, { memo } from 'react';
import { tableStore } from './tableStore';
import { ACTIONS_COLUMN_ID, Column } from './types';

interface VirtualRowProps<T> {
  row: T;
  columns: Column<T>[];
  visibility: Record<string, boolean>;
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right';
  index: number;
  height: number;
}

function VirtualRowComponent<T extends { id: string | number }>({
  row,
  columns,
  visibility,
  onRowSelect,
  onRowSelectEvent,
  index,
  height,
}: VirtualRowProps<T>) {
  const { columnWidths } = useStore(tableStore);
  return (
    <Table.Row
      data-index={index}
      onClick={(e) => onRowSelectEvent === 'left' && onRowSelect?.(row, e)}
      cursor={onRowSelect ? 'pointer' : 'default'}
      h={`${height}px`}
      _hover={{ bg: 'gray.50' }}
    >
      {columns.map((col) => {
        if (col.id !== ACTIONS_COLUMN_ID && visibility[col.id] === false) return null;

        return (
          <Table.Cell
            key={col.id}
            py={0}
            height={`${height}px`}
            width={`${columnWidths[col.id] ?? 180}px`} // ← ADD THIS
            minWidth={col.minWidth || '80px'}
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

const VirtualRow = memo(VirtualRowComponent) as typeof VirtualRowComponent;

export default function TableRows<T extends { id: string | number }>({
  data,
  columns,
  rowVirtualizer,
  onRowSelect,
  onRowSelectEvent = 'left',
  rowHeight,
}: {
  data: T[];
  columns: Column<T>[];
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right';
  rowHeight: number;
}) {
  const { visibility } = useStore(tableStore);

  const virtualItems = rowVirtualizer.getVirtualItems();

  // "Padding" virtualization method (Smoothest for table elements)
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <Table.Body>
      {paddingTop > 0 && (
        <Table.Row h={`${paddingTop}px`}>
          {/* Render a single cell spanning all cols to maintain table structure */}
          <Table.Cell colSpan={columns.length} p={0} border="none" h={`${paddingTop}px`} />
        </Table.Row>
      )}

      {virtualItems.map((virtualRow) => {
        const row = data[virtualRow.index];
        // Safety check in case data slicing is slightly off
        if (!row) return null;

        return (
          <VirtualRow
            key={row.id}
            index={virtualRow.index}
            row={row}
            columns={columns}
            visibility={visibility}
            onRowSelect={onRowSelect}
            onRowSelectEvent={onRowSelectEvent}
            height={rowHeight}
          />
        );
      })}

      {paddingBottom > 0 && (
        <Table.Row h={`${paddingBottom}px`}>
          <Table.Cell colSpan={columns.length} p={0} border="none" h={`${paddingBottom}px`} />
        </Table.Row>
      )}
    </Table.Body>
  );
}
