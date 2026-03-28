'use client';

import {
  Box,
  ButtonGroup,
  createListCollection,
  HStack,
  IconButton,
  Pagination,
  Portal,
  Select,
  Text,
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { withChildren } from '../../utils/chakra-slot';
interface TablePaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  siblingCount?: number;
  onPageChange?: (page: number) => void | undefined;
  onPageSizeChange?: (size: number) => void | undefined;
  pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const SelectPositioner = withChildren(Select.Positioner);
const SelectContent = withChildren(Select.Content);
const SelectItem = withChildren(Select.Item);
const PaginationPrev = withChildren(Pagination.PrevTrigger);
const PaginationNext = withChildren(Pagination.NextTrigger);
const SelectHiddenSelect = withChildren(Select.HiddenSelect);
const SelectControl = withChildren(Select.Control);
const SelectTrigger = withChildren(Select.Trigger);
const SelectValueText = withChildren(Select.ValueText);
const SelectIndicatorGroup = withChildren(Select.IndicatorGroup);
const SelectIndicator = withChildren(Select.Indicator);

export default function TablePagination({
  totalCount,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  siblingCount = 2,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TablePaginationProps) {
  const pageSizeCollection = createListCollection({
    items: pageSizeOptions.map((size) => ({
      label: String(size),
      value: String(size),
    })),
  });
  return (
    <Box width="100%">
      <HStack justify="space-between" mx="auto" flexWrap="wrap">
        <HStack>
          <Text fontSize="sm" _dark={{ color: 'gray.400' }}>
            Rows per page:
          </Text>

          <Select.Root
            collection={pageSizeCollection}
            size="sm"
            width="60px"
            onValueChange={(value) => onPageSizeChange?.(Number(value.items[0].value))}
            value={[String(pageSize)]}
            color={'gray.600'}
          >
            <SelectHiddenSelect />
            <SelectControl>
              <SelectTrigger>
                <SelectValueText placeholder="" />
              </SelectTrigger>
              <SelectIndicatorGroup>
                <SelectIndicator />
              </SelectIndicatorGroup>
            </SelectControl>
            <Portal>
              <SelectPositioner>
                <SelectContent>
                  {pageSizeCollection.items.map((framework) => (
                    <SelectItem item={framework.value} key={framework.value}>
                      {framework.label}
                      <Select.ItemIndicator />
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPositioner>
            </Portal>
          </Select.Root>
          <Text fontSize="sm" _dark={{ color: 'gray.400' }}>
            of {totalCount}
          </Text>
        </HStack>

        {/* PAGINATION */}
        <Pagination.Root
          count={totalCount}
          pageSize={pageSize}
          page={currentPage}
          siblingCount={siblingCount}
          onPageChange={(e) => onPageChange && onPageChange(e.page)}
        >
          <ButtonGroup size="sm" variant="ghost">
            <PaginationPrev asChild>
              <IconButton aria-label="Previous page">
                <ChevronLeft size={18} />
              </IconButton>
            </PaginationPrev>

            <Pagination.Items
              render={(item) => (
                <IconButton
                  key={item.value ?? item.type}
                  variant={item.type === 'page' && item.value === currentPage ? 'outline' : 'ghost'}
                  aria-current={
                    item.type === 'page' && item.value === currentPage ? 'page' : undefined
                  }
                >
                  {item.type === 'page' ? item.value : '…'}
                </IconButton>
              )}
            />

            <PaginationNext asChild>
              <IconButton aria-label="Next page">
                <ChevronRight size={18} />
              </IconButton>
            </PaginationNext>
          </ButtonGroup>
        </Pagination.Root>
      </HStack>
    </Box>
  );
}
