'use client';

import { Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import SortableHeaderCell from './SortableHeaderCell';
import { tableStore } from './tableStore';

const VISIBILITY_ID = '__visibility__';

export default function TableHeader() {
  const { columnOrder, visibility, enableColumnVisibility } =
  useStore(tableStore);

const orderedColumns = enableColumnVisibility
  ? [
      ...columnOrder.filter((c) => c.id !== VISIBILITY_ID),
      ...columnOrder.filter((c) => c.id === VISIBILITY_ID),
    ]
  : columnOrder.filter((c) => c.id !== VISIBILITY_ID);

  return (
    <Table.Header position="sticky" top={0} zIndex={1}>
      <Table.Row height="28px">
        {orderedColumns.map((col) => {
          if (col.id === VISIBILITY_ID) {
            return (
              <Table.ColumnHeader key={col.id} width="50px">
                <ColumnVisibilityMenu visibility={visibility} />
              </Table.ColumnHeader>
            );
          }

          // const isSorted = sortColumn === col.id;

          return (
            <SortableHeaderCell
              key={col.id}
              id={col.id}
              minW={col.minWidth}
              // onClick={() => col.sortable && sortByColumn(col.id)}
              // backgroundColor={col.backgroundColor}
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

                {/* {col.sortable &&
                  (isSorted ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp size={14} />
                    ) : (
                      <ArrowDown size={14} />
                    )
                  ) : (
                    <ArrowUpDown size={14} opacity={0.4} />
                  ))} */}
              </span>
            </SortableHeaderCell>
          );
        })}
      </Table.Row>
    </Table.Header>
  );
}
