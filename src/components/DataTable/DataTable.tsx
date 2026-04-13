'use client';

import { Box, Spinner, Table } from '@chakra-ui/react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useStore } from '@tanstack/react-store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';

import { setColumnOrder } from './DataTableActions';
import TableHeader from './DataTableHeader';
import TablePagination from './DataTablePagination';
import TableRows from './DataTableRow';
import DataTableSkeleton from './DataTableSkeleton';
import { setData, setTableId, tableStore } from './tableStore';
import { DataTableProps } from './types';
import { sortRows } from './utils';

interface ExtendedDataTableProps<T> extends DataTableProps<T> {
  manualPagination?: boolean;
}

export default function DataTable<T extends { id: string | number }>({
  tableId,
  data: rowData = [],
  headers = [],
  loading = false,
  loadingChildren,
  skeletonLoading = false,
  emptyMessage = 'No data',
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  density = 'sm',
  totalCount = 0,
  pageSizeOptions,
  onRowSelect,
  onRowSelectEvent = 'left',
  enableColumnVisibility = true,
  dataType = 'pagination',
  manualPagination = false,
}: ExtendedDataTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTableId(tableId);
  }, [tableId]);

  useEffect(() => {
    setData(rowData, headers, enableColumnVisibility);
  }, [rowData, headers, enableColumnVisibility]);

  const { sortColumn, sortDirection, data, columnOrder } = useStore(tableStore);

  const effectiveColumns = useMemo(
    () => (columnOrder.length ? columnOrder : headers),
    [columnOrder, headers],
  );

  const processedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    const column = effectiveColumns.find((c) => c.id === sortColumn) as any;
    return sortRows(data, column, sortDirection);
  }, [data, sortColumn, sortDirection, effectiveColumns]);

  const startIndex = (Math.max(1, page) - 1) * pageSize;

  const displayData = useMemo(() => {
    if (dataType === 'infinite') {
      return processedData;
    }

    const isServerSide =
      manualPagination ||
      totalCount > processedData.length ||
      (page > 1 && processedData.length > 0 && processedData.length <= pageSize);

    if (isServerSide) {
      return processedData;
    }

    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, startIndex, pageSize, dataType, page, totalCount, manualPagination]);

  const getRowHeight = () => {
    if (density === 'sm') return 45;
    if (density === 'md') return 56;
    return 64;
  };
  const rowHeight = getRowHeight();

  const rowVirtualizer = useVirtualizer({
    count: displayData.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeight,
    overscan: 25,
  });

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = effectiveColumns.findIndex((c) => c.id === active.id);
    const newIndex = effectiveColumns.findIndex((c) => c.id === over.id);

    setColumnOrder(arrayMove(effectiveColumns, oldIndex, newIndex));
  };

  const showOverlayLoader = loading && !skeletonLoading;
  const showSkeleton = skeletonLoading && !loading;
  const showEmpty = !loading && !skeletonLoading && displayData.length === 0;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={effectiveColumns.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <Box
          flex="1"
          minH={0}
          display="flex"
          flexDirection="column"
          p={1}
          background={'white'}
          borderRadius={'sm'}
        >
          <Box
            ref={tableContainerRef}
            flex="1"
            minH={0}
            position="relative"
            overflowX="auto"
            css={{
              '&::-webkit-scrollbar': { width: '8px', height: '8px' },
              willChange: 'transform',
            }}
          >
            {showOverlayLoader && (
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex={10}
                bg="whiteAlpha.600"
              >
                {loadingChildren ?? <Spinner />}
              </Box>
            )}

            <Table.Root
              variant="outline"
              w="max-content"
              minW="100%"
              size={density}
              tableLayout="fixed"
              css={{
                borderCollapse: 'collapse',
                '& th, & td': {
                  boxSizing: 'border-box',
                },
              }}
            >
              <TableHeader />

              {showSkeleton ? (
                <DataTableSkeleton rows={pageSize} columns={effectiveColumns.length} />
              ) : showEmpty ? (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell
                      colSpan={effectiveColumns.length}
                      textAlign="center"
                      h="200px"
                      color="gray.500"
                    >
                      {emptyMessage}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ) : (
                <TableRows
                  data={displayData}
                  columns={effectiveColumns}
                  onRowSelect={onRowSelect}
                  onRowSelectEvent={onRowSelectEvent}
                  rowHeight={rowHeight}
                />
              )}
            </Table.Root>
          </Box>

          {dataType === 'pagination' && (
            <Box mt={0.5} bg={'gray.100'} color={'gray.600'} p={2}>
              <TablePagination
                totalCount={totalCount}
                pageSize={pageSize}
                currentPage={page}
                onPageChange={(p) => {
                  if (tableContainerRef.current) tableContainerRef.current.scrollTop = 0;
                  onPageChange?.(p);
                }}
                onPageSizeChange={(size) => {
                  onPageSizeChange?.(size);
                  page > 1 && onPageChange?.(1);
                }}
                pageSizeOptions={pageSizeOptions}
              />
            </Box>
          )}

          {dataType === 'infinite' && (
            <Box mt={2} px={2} fontSize="sm" color="white">
              Showing {displayData.length} rows
            </Box>
          )}
        </Box>
      </SortableContext>
    </DndContext>
  );
}
