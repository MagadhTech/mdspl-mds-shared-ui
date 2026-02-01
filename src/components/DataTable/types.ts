import React, { JSX } from 'react';

export type DensityType = 'sm' | 'md' | 'lg';
export type SortOrder = 'asc' | 'desc';

export interface Column {
  id: string;
  label: string | React.ReactNode;
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  backgroundColor?: string;
}

export interface DataTableAction<T> {
  icon: JSX.Element;
  label: string;
  onClick: (row: T) => void;
  visible?: (row: T) => boolean;
  colorScheme?:
    | 'gray'
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'teal'
    | 'blue'
    | 'cyan'
    | 'purple'
    | 'pink';
}

export type ActionHeaderProps = {
  backgroundColor?: string;
  children?: React.ReactNode;
  showActionColumn?: boolean;
  width?: string;
  showColumnVisibilityMenu?: boolean;
  backgroundColorColumnVisibilityMenu?: string;
  showSNo?: boolean;
  indexChildren?: React.ReactNode;
};

// export type DataTableRow<T> = {
//   __key?: string | number;
//   __raw?: T;
//   id ?: string | number
// } & Record<string, React.ReactNode>;

export type DataTableRow<T> = {
  __key?: string | number;
  __raw: T;
  id?: string | number;
  cells?: Record<string, React.ReactNode>;
};

export interface DataTableProps<T> {
  tableId: string;
  headers?: Column[];
  data?: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: DataTableAction<T>[];
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void | undefined;
  onPageSizeChange?: (size: number) => void | undefined;
  density?: DensityType;
  totalCount?: number;
  actionConfig?: ActionHeaderProps;
  loadingChildren?: JSX.Element;
  skeletonLoading?: boolean;
  pageSizeOptions?: number[];
  onRowSelect?: (row: T, event?: React.MouseEvent) => void;
  onRowSelectEvent?: 'left' | 'right';
}
