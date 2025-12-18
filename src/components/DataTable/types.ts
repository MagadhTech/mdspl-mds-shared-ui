export type DensityType = 'sm' | 'md' | 'lg';
export type SortOrder = 'asc' | 'desc';

export interface Column<T = unknown> {
  id: string;
  label: string;
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  format?: (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableAction<T = unknown> {
  icon: React.ReactNode;
  label: string;
  onClick: (row: T) => void;
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

// export interface IDensityType "comfortable" | "standard" | "compact";

export interface DataTableProps<T = unknown> {
  // columns: Column<T>[];
  // data: T[];
  // loading?: boolean;
  // page?: number;
  // rowsPerPage?: number;
  // totalRows?: number;
  // onPageChange?: (page: number) => void;
  // onRowsPerPageChange?: (rowsPerPage: number) => void;
  // onRowClick?: (row: T) => void;
  // actions?: DataTableAction<T>[];
  // emptyMessage?: string;
  // density?: DensityType;
  // showIndex?: boolean;
  // pageKey: string; // required for persistence

  // headers: Column<T>[];
  data?: T[];
  loading?: boolean;
  emptyMessage?: string;
  actions?: DataTableAction<T>[];
  showIndex?: boolean;
  page?: number;
  pageSize?: number;
  hideHeaderList?: Record<string, boolean>;
  onPageChange?: (page: number) => void | undefined;
  onPageSizeChange?: (size: number) => void | undefined;
  density?: DensityType;
}
