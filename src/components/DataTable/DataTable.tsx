'use client';

import { Box, Spinner, Table } from '@chakra-ui/react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useStore } from '@tanstack/react-store';
import { useEffect, useMemo } from 'react';
import { formatDataTableRows } from '../../utils/FormatCell';
import { setColumnOrder } from './DataTableActions';
import TableHeader from './DataTableHeader';
import TablePagination from './DataTablePagination';
import TableRows from './DataTableRow';
import DataTableSkeleton from './DataTableSkeleton';
import { setActionsConfig, setData, setTableId, tableStore } from './tableStore';
import { DataTableProps, DataTableRow } from './types';

export default function DataTable<T>({
  tableId,
  data: rowData = [],
  headers = [],
  loading = false,
  loadingChildren,
  skeletonLoading = false,
  emptyMessage = 'No data',
  actions,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  density = 'sm',
  totalCount = 0,
  actionConfig,
  pageSizeOptions,
  onRowSelect,
  onRowSelectEvent = 'left',
}: DataTableProps<T>) {
  useEffect(() => {
    setTableId(tableId);
  }, [tableId]);

  useEffect(() => {
    setData(rowData, headers);
  }, [rowData, headers]);

  useEffect(() => {
    if (actionConfig) {
      setActionsConfig(actionConfig);
    }
  }, [actionConfig]);

  const { sortColumn, sortDirection, data: newData, columnOrder } = useStore(tableStore);

  const processedData = useMemo(() => {
    const data = [...newData];
    const safePage = Math.max(1, page || 1);

    if (sortColumn) {
      data.sort((a, b) =>
        sortDirection === 'asc'
          ? String(a[sortColumn]).localeCompare(String(b[sortColumn]))
          : String(b[sortColumn]).localeCompare(String(a[sortColumn])),
      );
    }

    return data;
  }, [newData, sortColumn, sortDirection, page, pageSize]);

  // const startIndex = (page - 1) * pageSize;
  const startIndex = useMemo(() => {
    const safePage = Math.max(1, page || 1);
    return (safePage - 1) * pageSize;
  }, [page, pageSize]);

  useEffect(() => {
    if (page < 1 && onPageChange) {
      onPageChange(1);
    }
  }, [page, onPageChange]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = columnOrder.findIndex((col) => col.id === active.id);
    const newIndex = columnOrder.findIndex((col) => col.id === over.id);

    const newOrder = arrayMove(columnOrder, oldIndex, newIndex);
    setColumnOrder(newOrder);
  };

  const showOverlayLoader = loading && !skeletonLoading;
  const showSkeleton = skeletonLoading && !loading;
  const showEmpty = !loading && !skeletonLoading && processedData.length === 0;

  const formattedRows = useMemo<DataTableRow<T>[]>(() => {
    return formatDataTableRows(processedData, columnOrder);
  }, [processedData, columnOrder]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext
        items={columnOrder.map((c) => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <Box flex="1" minH={0} display="flex" flexDirection="column" p={2}>
          <Box flex="1" minH={0} position="relative" overflowX="auto" overflowY="auto">
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
              key={tableId}
              tableLayout={'fixed'}
              minW={'max-content'}
            >
              <TableHeader />

              {showSkeleton ? (
                <DataTableSkeleton rows={pageSize} columns={headers.length + (actions ? 2 : 0)} />
              ) : showEmpty ? (
                <Table.Body>
                  <Table.Row>
                    <Table.Cell colSpan={headers.length + (actions ? 1 : 0)}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minH="200px"
                        color="gray.500"
                      >
                        {emptyMessage}
                      </Box>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ) : (
                <TableRows
                  data={formattedRows}
                  actions={actions}
                  actionConfig={actionConfig}
                  onRowSelect={onRowSelect}
                  startIndex={startIndex}
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
              onPageSizeChange={(s) => {
                onPageSizeChange?.(s);
                if (page > 1) onPageChange?.(1);
              }}
              pageSizeOptions={pageSizeOptions}
            />
          </Box>
        </Box>
      </SortableContext>
    </DndContext>
  );
}
