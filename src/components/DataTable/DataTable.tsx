'use client';

import { Box, Spinner, Table } from '@chakra-ui/react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '@tanstack/react-store';
import { useEffect, useMemo } from 'react';

import { setColumnOrder } from './DataTableActions';
import TableHeader from './DataTableHeader';
import TablePagination from './DataTablePagination';
import TableRows from './DataTableRow';
import DataTableSkeleton from './DataTableSkeleton';
import { setData, setTableId, tableStore } from './tableStore';
import { DataTableProps } from './types';
import { sortRows } from './utils';

export default function DataTable<T>({
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
}: DataTableProps<T>) {

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

  const column = effectiveColumns.find(
    (c) => c.id === sortColumn,
  ) as any;

  return sortRows(data, column, sortDirection);
}, [data, sortColumn, sortDirection, effectiveColumns]);

  /* ---------------- pagination ---------------- */

  const startIndex = useMemo(() => (Math.max(1, page) - 1) * pageSize, [page, pageSize]);

  const paginatedData = useMemo(
    () => processedData.slice(startIndex, startIndex + pageSize),
    [processedData, startIndex, pageSize],
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = effectiveColumns.findIndex((c) => c.id === active.id);
    const newIndex = effectiveColumns.findIndex((c) => c.id === over.id);

    setColumnOrder(arrayMove(effectiveColumns, oldIndex, newIndex));
  };

  const showOverlayLoader = loading && !skeletonLoading;
  const showSkeleton = skeletonLoading && !loading;
  const showEmpty = !loading && !skeletonLoading && processedData.length === 0;

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={effectiveColumns.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <Box flex="1" minH={0} display="flex" flexDirection="column" p={2}>
          <Box flex="1" minH={0} position="relative" overflow="auto">
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
              w="100%"
              size={density}
              tableLayout="fixed"
              minW="max-content"
            >
              <TableHeader />

              {showSkeleton ? (
                <DataTableSkeleton rows={pageSize} columns={effectiveColumns.length} />
              ) : showEmpty ? (
                <Table.Body>
                  <Table.Row>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minH="200px"
                      color="gray.500"
                      w="100%"
                    >
                      {emptyMessage}
                    </Box>
                  </Table.Row>
                </Table.Body>
              ) : (
                <TableRows
                  data={paginatedData}
                  columns={effectiveColumns}
                  onRowSelect={onRowSelect}
                  onRowSelectEvent={onRowSelectEvent}
                />
              )}
            </Table.Root>
          </Box>

          <Box mt={0.5}>
            <TablePagination
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={page}
              onPageChange={onPageChange}
              onPageSizeChange={(size) => {
                onPageSizeChange?.(size);
                page > 1 && onPageChange?.(1);
              }}
              pageSizeOptions={pageSizeOptions}
            />
          </Box>
        </Box>
      </SortableContext>
    </DndContext>
  );
}
