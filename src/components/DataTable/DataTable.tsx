'use client';

import { Box, Table } from '@chakra-ui/react';
import { useStore } from '@tanstack/react-store';
import { useMemo } from 'react';
import { dummyData } from '../../dummy/data';
import TableHeader from './DataTableHeader';
import TablePagination from './DataTablePagination';
import TableRows from './DataTableRow';
import { setData, tableStore } from './tableStore';
import { DataTableProps } from './types';

export default function DataTable<T extends Record<string, unknown>>({
  // headers,
  data: rowData = [],
  loading = false,
  emptyMessage = 'No data',
  actions,
  showIndex = true,
  page = 0,
  pageSize = 10,
  hideHeaderList = {},
  onPageChange,
  onPageSizeChange,
  density = 'sm',
}: DataTableProps<T>) {
  useMemo(() => {
    setData(rowData);
  }, [rowData]);

  const { sortColumn, sortDirection, data: newData } = useStore(tableStore);

  const processedData = useMemo(() => {
    const data = [...newData];

    if (sortColumn) {
      data.sort((a, b) =>
        sortDirection === 'asc'
          ? String(a[sortColumn]).localeCompare(String(b[sortColumn]))
          : String(b[sortColumn]).localeCompare(String(a[sortColumn])),
      );
    }

    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [page, pageSize, sortColumn, sortDirection]);


  return (
    <Box h="100vh" display="flex" flexDirection="column" p={2} pt={2}>
      <Box flex="1" overflow="hidden">
        <Box h="100%" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="md">
          <Table.Root variant="outline" w="100%" size={density}>
            <TableHeader />
            <TableRows data={processedData} />
          </Table.Root>
        </Box>
      </Box>

      <Box mt={0.5}>
        <TablePagination
          totalCount={rowData.length}
          pageSize={pageSize}
          currentPage={page}
          onPageChange={onPageChange}
          onPageSizeChange={(s) => {
            if (onPageSizeChange) {
              onPageSizeChange(s);
            }
            if (page > 1 && onPageChange) {
              onPageChange(1);
            }
          }}
        />
      </Box>
    </Box>
  );
}
