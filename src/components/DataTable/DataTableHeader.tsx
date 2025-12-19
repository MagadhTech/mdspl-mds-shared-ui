'use client';

import { Table } from '@chakra-ui/react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@tanstack/react-store';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import { setColumnOrder, sortByColumn, toggleColumn } from './DataTableActions';
import SortableHeaderCell from './SortableHeaderCell';
import { tableStore } from './tableStore';

export default function TableHeader() {
  const { columnOrder, visibility, sortColumn, sortDirection, sortebleColumns } =
    useStore(tableStore);

  console.log(columnOrder, 'fomr header');

  const visibleOrderedColumns = columnOrder
    .map((id) => sortebleColumns.find((c) => c.id === id)!)
    .filter((c) => visibility[c.id]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnOrder.indexOf(active.id as string);
    const newIndex = columnOrder.indexOf(over.id as string);

    setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
  };

  return (
    <Table.Header background={'gray.100'} position="sticky" top={0} p="0">
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
          <Table.Row height={'28px'}>
            {visibleOrderedColumns.map((col, index) => {
              const isSorted = sortColumn === col?.id;
              const isLast = index === visibleOrderedColumns.length - 1;

              return (
                <SortableHeaderCell
                  key={col?.id}
                  id={col?.id}
                  onClick={() => col?.sortable && sortByColumn(col?.id)}
                  cursor={col?.sortable ? 'pointer' : 'default'}
                  borderRight={!isLast ? '2px solid' : undefined}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      userSelect: 'none',
                    }}
                  >
                    {col?.label}

                    {col?.sortable &&
                      (isSorted ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} opacity={0.4} />
                      ))}
                  </span>
                </SortableHeaderCell>
              );
            })}

            <Table.ColumnHeader borderRight="2px solid" borderRightColor="gray.300">
              Actions
            </Table.ColumnHeader>

            <Table.ColumnHeader boxSize={'0.5'}>
              <ColumnVisibilityMenu visibility={visibility} onToggle={toggleColumn} />
            </Table.ColumnHeader>
          </Table.Row>
        </SortableContext>
      </DndContext>
    </Table.Header>
  );
}
