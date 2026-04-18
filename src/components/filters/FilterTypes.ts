import { JSX, ReactNode } from 'react';

export interface FilterOption<T = unknown> {
  label: ReactNode;
  value: T;
  displayValue?: string | ReactNode;
}
export interface IFilterConfig<T = any> {
  id: string;
  label: string;
  type?:
    | 'date'
    | 'text'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'number'
    | 'combobox'
    | 'date-range'
    | 'button';
  value: string | number | undefined | boolean | Date | any;
  options?: FilterOption<T>[];
  onChange?: (value: any) => void;
  onClick?: () => void;
  visible: boolean;
  buttonSize?: 'sm' | 'md' | 'lg' | 'xs';
  size?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  customComponent?: JSX.Element;
  placeholder?: string;
  startDate?: string | null;
  endDate?: string | null;
}

export interface IMainFilterType {
  title?: JSX.Element;
  filters: IFilterConfig[];
  onVisibilityChange?: (id: string, visible: boolean) => void;
  onReorder?: (newOrder: IFilterConfig[]) => void;
  onSizeChange?: (id: string, size: number) => void;
  onClear?: () => void;
  maxToolbarUnits?: number;
  filterDrawerSize?: 'md' | 'lg' | 'sm';

  //   preset props
  pageKey?: string;
  currentFilters?: Record<string, unknown>;
  onLoadPreset?: (filters: IFilterConfig[], presetName?: string) => void;
  activePresetName?: string | null;
}

export interface IFilterDrawerProps {
  filters: IFilterConfig[];
  onVisibilityChange?: (id: string, visible: boolean) => void;
  onReorder?: (newOrder: IFilterConfig[]) => void;
  onSizeChange?: (id: string, size: number) => void;
  onClear?: () => void;
  maxToolbarUnits?: number;
  filterDrawerSize?: 'md' | 'lg' | 'sm';
  pageKey?: string;
  onLoadPreset?: (filters: IFilterConfig[], presetName?: string) => void;
  activePresetName?: string | null;
}
