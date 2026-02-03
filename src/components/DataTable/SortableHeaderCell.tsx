'use client';

import { Box, HStack, Table } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '@tanstack/react-store';
import { ArrowLeftRight, GripVertical } from 'lucide-react';
import { useRef, useState } from 'react';
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
  // If no saved width → fall back to auto / flex behavior instead of fixed px
  // const savedWidth = columnWidths[id];
  // const widthStyle = savedWidth ? `${savedWidth}px` : 'auto'; // ← key change
  const savedWidth = columnWidths[id];
  const defaultWidth = 180; // fallback if somehow missing (shouldn't after setData)
  const widthPx = savedWidth ?? defaultWidth;
  const widthStyle = `${widthPx}px`;

  const startX = useRef(0);
  const startWidth = useRef(0);

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id });

  // const onMouseDown = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   startX.current = e.clientX;
  //   startWidth.current = (e.currentTarget as HTMLElement).offsetWidth || 150;

  //   const onMove = (ev: MouseEvent) => {
  //     const newWidth = startWidth.current + (ev.clientX - startX.current);
  //     setColumnWidth(id, newWidth);
  //   };

  //   const onUp = () => {
  //     document.removeEventListener('mousemove', onMove);
  //     document.removeEventListener('mouseup', onUp);
  //   };

  //   document.addEventListener('mousemove', onMove);
  //   document.addEventListener('mouseup', onUp);
  // };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;

    // Find the parent <th> (resize Box → HStack → th)
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
      width={widthStyle} // ← use 'auto' when no saved width
      minWidth={minW || '80px'} // prevent collapse
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        cursor,
        borderRight,
        boxSizing: 'border-box',
        // flex: savedWidth ? undefined : '1 1 auto', // ← makes it grow if no fixed width
      }}
      bg={'gray.100'}
      {...attributes}
    >
      <HStack position="relative" width="100%">
        <span {...listeners}>
          <GripVertical size={12} style={{ cursor: 'grab' }} />
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
