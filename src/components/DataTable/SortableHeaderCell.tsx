'use client';

import { HStack, Table } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function SortableHeaderCell({
  id,
  children,
  onClick,
  cursor,
  borderRight,
  borderRightColor,
}: {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  cursor?: string;
  borderRight?: string;
  borderRightColor?: string;
}) {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id });

  return (
    <Table.ColumnHeader
      ref={setNodeRef}
      onClick={onClick}
      w={id === 'id' ? '80px' : undefined}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: cursor,
        borderRight: borderRight,
        borderRightColor: borderRightColor,
      }}
      {...attributes}
    >
      <HStack justify="space-between">
        {children}
        <span {...listeners}>
          <GripVertical size={12} />
        </span>
      </HStack>
    </Table.ColumnHeader>
  );
}
