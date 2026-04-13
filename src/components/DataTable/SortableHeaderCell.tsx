'use client';

import { Box, HStack, Table } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '@tanstack/react-store';
import { ArrowLeftRight, GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import { setColumnWidth } from './DataTableActions';
import { tableStore } from './tableStore';
import { ACTIONS_COLUMN_ID } from './types';

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

  // Force exactly 30px for the actions column, otherwise use saved/default width
  const isActions = id === ACTIONS_COLUMN_ID;
  const savedWidth = columnWidths[id];
  const defaultWidth = 100;
  const widthPx = isActions ? 30 : (savedWidth ?? defaultWidth);
  const widthStyle = `${widthPx}px`;

  const startX = useRef(0);
  const startWidth = useRef(0);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id,
  });

  const onMouseDown = (e: React.MouseEvent) => {
    if (isActions) return;
    e.stopPropagation();
    startX.current = e.clientX;

    const thElement = (e.currentTarget as HTMLElement).closest('th');
    startWidth.current = thElement?.getBoundingClientRect().width || columnWidths[id] || 180;

    const onMove = (ev: MouseEvent) => {
      let newWidth = startWidth.current + (ev.clientX - startX.current);
      setColumnWidth(id, newWidth);
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
      width={widthStyle}
      minWidth={isActions ? '30px' : minW || '20px'}
      maxWidth={isActions ? '30px' : undefined}
      px={2} // <-- Makes header compact horizontally
      py={1} // <-- Makes header compact vertically
      h="32px" // <-- Forces a strictly small height
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        cursor,
        borderRight: isActions ? 'none' : borderRight,
        boxSizing: 'border-box',
        zIndex: isDragging ? 10 : 1, // ✅ Keeps dragged column on top
        position: isDragging ? 'relative' : 'static', // ✅ Required for z-index to work
      }}
      bg={'gray.100'}
      {...attributes}
    >
      <HStack position="relative" width="100%" gap={1}>
        {!isActions && (
          <span {...listeners} style={{ display: 'flex', alignItems: 'center' }}>
            <GripVertical size={12} style={{ cursor: 'grab', color: '#a0aebc' }} />
          </span>
        )}

        {/* Ensures the content fits well even in the 30px space */}
        <Box
          flex="1"
          overflow="hidden"
          display="flex"
          justifyContent={isActions ? 'center' : 'flex-start'}
        >
          {children}
        </Box>

        {!isActions && (
          <Box
            position="absolute"
            right={-2} // shifted slightly to align better with border
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
        )}
      </HStack>
    </Table.ColumnHeader>
  );
}
