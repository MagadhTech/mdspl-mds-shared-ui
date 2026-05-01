'use client';

import { Box, Flex, Spinner, Table, Text, VStack } from '@chakra-ui/react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useStore } from '@tanstack/react-store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef } from 'react';

import { FolderSearch } from 'lucide-react';
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
                <Table.Body h="100%">
                  <Table.Row h="100%" border="none" borderBottomWidth={0}>
                    <Table.Cell
                      colSpan={effectiveColumns.length}
                      border={'none'}
                      borderBottom="none"
                      h="100%"
                      p={0} // Remove cell padding so the Flex container handles it
                    >
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        h="100%"
                        minH="50vh" // Fallback minimum height
                        w="100%"
                        p={10}
                      >
                        <VStack gap={5}>
                          {/* Soft background circle behind the icon */}
                          <Flex
                            align="center"
                            justify="center"
                            h="80px"
                            w="80px"
                            rounded="full"
                            bg="gray.50"
                            border="1px solid"
                            borderColor="gray.100"
                          >
                            <FolderSearch
                              size={40}
                              strokeWidth={1.5}
                              color="var(--chakra-colors-gray-400)"
                            />
                          </Flex>

                          <VStack gap={1}>
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                              No Results Found
                            </Text>
                            <Text fontSize="sm" color="gray.500" textAlign="center" maxW="sm">
                              {emptyMessage ||
                                "We couldn't find any records matching your current filters. Try adjusting your search criteria."}
                            </Text>
                          </VStack>
                        </VStack>
                      </Flex>
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
