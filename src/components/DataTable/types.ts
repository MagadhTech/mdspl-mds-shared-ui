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


export interface DataTableProps<T = unknown> {
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
