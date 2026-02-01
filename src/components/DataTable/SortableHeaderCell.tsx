'use client';

import { Box, HStack, Table } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeftRight, GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';
// import { setColumnWidth } from './DataTableActions';
import { useStore } from '@tanstack/react-store';
import { setColumnWidth } from './DataTableActions';
import { tableStore } from './tableStore';

export default function SortableHeaderCell({
  id,
  children,
  onClick,
  cursor,
  borderRight,
  backgroundColor,
  minW,
}: {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
  cursor?: string;
  borderRight?: string;
  backgroundColor?: string;
  minW?: string | number;
}) {
  const { columnWidths } = useStore(tableStore);
  const width = columnWidths[id];

  const startX = useRef(0);
  const startWidth = useRef(0);

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id });

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;
    startWidth.current = width ?? 150;

    const onMove = (ev: MouseEvent) => {
      setColumnWidth(id, startWidth.current + (ev.clientX - startX.current));
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const [showResizeIcon, setShowResizeIcon] = useState(false);

  return (
    <Table.ColumnHeader
      ref={setNodeRef}
      onClick={onClick}
      backgroundColor={backgroundColor}
      w={width ? `${width}px` : undefined}
      minW={minW}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor,
        borderRight,
      }}
      {...attributes}
    >
      <HStack position="relative">
        <span {...listeners}>
          <GripVertical
            size={12}
            style={{
              cursor: 'grab',
            }}
          />
        </span>
        {children}

        <Box
          position="absolute"
          right={0}
          top={0}
          h="100%"
          w="10px"
          cursor="col-resize"
          onMouseDown={onMouseDown}
          onMouseEnter={() => setShowResizeIcon(true)}
          onMouseLeave={() => setShowResizeIcon(false)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          {showResizeIcon && (
            <ArrowLeftRight size={14} style={{ pointerEvents: 'none', opacity: 0.8 }} />
          )}
        </Box>
      </HStack>
    </Table.ColumnHeader>
  );
}
