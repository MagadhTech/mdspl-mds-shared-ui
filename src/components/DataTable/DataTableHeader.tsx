'use client';

import { Table } from '@chakra-ui/react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@tanstack/react-store';
import { COLUMNS, type ColumnId } from './Column';
import ColumnVisibilityMenu from './ColumnVisibilityMenu';
import { setColumnOrder, sortByColumn, toggleColumn } from './DataTableActions';
import SortableHeaderCell from './SortableHeaderCell';
import { tableStore } from './tableStore';

export default function TableHeader() {
  const { columnOrder, visibility } = useStore(tableStore);

  const visibleOrderedColumns = columnOrder
    .map((id) => COLUMNS.find((c) => c.id === id)!)
    .filter((c) => visibility[c.id]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnOrder.indexOf(active.id as ColumnId);
    const newIndex = columnOrder.indexOf(over.id as ColumnId);

    setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
  };

  return (
    <Table.Header background={'gray.100'} position="sticky" top={0}>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
          <Table.Row>
            {visibleOrderedColumns.map((col) => (
              <SortableHeaderCell
                key={col.id}
                id={col.id}
                onClick={() => col.sortable && sortByColumn(col.id)}
              >
                {col.label}
              </SortableHeaderCell>
            ))}

            <Table.ColumnHeader boxSize={'3.5'}>Actions</Table.ColumnHeader>

            <Table.ColumnHeader boxSize={'0.5'}>
              <ColumnVisibilityMenu visibility={visibility} onToggle={toggleColumn} />
            </Table.ColumnHeader>
          </Table.Row>
        </SortableContext>
      </DndContext>
    </Table.Header>
  );
}
