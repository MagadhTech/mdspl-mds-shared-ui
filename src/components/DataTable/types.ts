import React, { JSX } from 'react';

export type DensityType = 'sm' | 'md' | 'lg';
export type SortOrder = 'asc' | 'desc';

export const ACTIONS_COLUMN_ID = '__actions__' as const;
export const VISIBILITY_COLUMN_ID = '__visibility__' as const;

type SortDirection = 'asc' | 'desc' | null;
type SortAccessor<T> = (row: T) => unknown;

type SortComparator<T> = (a: T, b: T, direction: Exclude<SortDirection, null>) => number;

interface BaseColumn {
  label: string | React.ReactNode;
  minWidth?: number | string;
  backgroundColor?: string;
}

interface DataColumn<T> extends BaseColumn {
  type?: 'data';
  id: keyof T & string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  sortAccessor?: SortAccessor<T>;
  sortComparator?: SortComparator<T>;
  render?: (row: T) => React.ReactNode;
}

interface ActionColumn<T> extends BaseColumn {
  type: 'actions';
  id: typeof ACTIONS_COLUMN_ID;
  render: (row: T) => React.ReactNode;
}

interface VisibilityColumn extends BaseColumn {
  type: 'visibility';
  id: typeof VISIBILITY_COLUMN_ID;
}

export type Column<T> = DataColumn<T> | ActionColumn<T> | VisibilityColumn;

export interface DataTableProps<T> {
  tableId: string;
  headers: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  density?: DensityType;
  totalCount?: number;
  loadingChildren?: JSX.Element;
  skeletonLoading?: boolean;
  pageSizeOptions?: number[];
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right';
  enableColumnVisibility?: boolean;
}
