'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import { sortByColumn } from './DataTableActions';
import SortableHeaderCell from './SortableHeaderCell';
import { tableStore } from './tableStore';
import { ACTIONS_COLUMN_ID, VISIBILITY_COLUMN_ID } from './types';

export default function TableHeader() {
  const { columnOrder, visibility, enableColumnVisibility, sortColumn, sortDirection } =
    useStore(tableStore);

  const orderedColumns = columnOrder
    .filter((col) => {
      if (!enableColumnVisibility && col.id === VISIBILITY_COLUMN_ID) {
        return false;
      }

      if (col.id === VISIBILITY_COLUMN_ID) return true;
      if (col.id === ACTIONS_COLUMN_ID) return true;

      return visibility[col.id] !== false;
    })
    .sort((a, b) => {
      if (a.id === VISIBILITY_COLUMN_ID) return 1;
      if (b.id === VISIBILITY_COLUMN_ID) return -1;
      return 0;
    });

  return (
    <Table.Header
      position="sticky"
      top={0}
      zIndex={1}
      css={{
        contain: 'layout style paint',
        backgroundColor: 'white',
      }}
    >
      <Table.Row height="28px">
        {orderedColumns.map((col) => {
          if (col.id === VISIBILITY_COLUMN_ID) {
            return (
              <Table.ColumnHeader key={col.id} bg={'gray.100'} w={100}>
                <ColumnVisibilityMenu visibility={visibility} />
              </Table.ColumnHeader>
            );
          }

          // FIX: Added !col.disableSort check
          const isSortable = col.type !== 'actions' && col.type !== 'visibility';
          const isSorted = sortColumn === col.id;

          return (
            <SortableHeaderCell
              key={col.id}
              id={col.id}
              minW={col.minWidth}
              onClick={isSortable ? () => sortByColumn(col.id) : undefined}
              cursor={isSortable ? 'pointer' : 'default'}
              borderRight="2px solid #dcdcdc"
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  userSelect: 'none',
                }}
              >
                {col.label}

                {isSortable &&
                  (isSorted ? (
                    sortDirection === 'asc' ? (
                      ' ▲'
                    ) : (
                      ' ▼'
                    )
                  ) : (
                    <span style={{ opacity: 0.4 }}> ⇅</span>
                  ))}
              </span>
            </SortableHeaderCell>
          );
        })}
      </Table.Row>
    </Table.Header>
  );
}
