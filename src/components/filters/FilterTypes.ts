import { ConditionalValue } from '@chakra-ui/react';
import { JSX } from 'react';

export interface IFilterConfig {
  id: string;
  label: string;
  type?: 'date' | 'text' | 'select' | 'checkbox' | 'radio' | 'number';
  value: string | number | undefined | boolean;
  options?: { label: string; value: string }[];
  onChange?: (value: string | number | boolean | undefined) => void;
  visible?: boolean; // This is used to control the visibility of the filter in the toolbar
  size?: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5;
  customComponent?: JSX.Element;
}

export interface IMainFilterType {
  title: JSX.Element;
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
  onLoadPreset?: (filters: Record<string, unknown>, name: string) => void;
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
  currentFilters?: Record<string, unknown>;
  onLoadPreset?: (filters: Record<string, unknown>, name: string) => void;
  activePresetName?: string | null;
}

export interface IMDSInputTypes {
  icon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  variant?: ConditionalValue<'subtle' | 'outline' | 'flushed' | undefined>;
  label?: string;
  helperText?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorText?: string;
}

export interface IMDSSelectBoxTypes {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  variant?: ConditionalValue<'subtle' | 'outline' | undefined>;
  label?: string;
  helperText?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorText?: string;
}

export interface IMDSCheckboxTypes {
  value?: boolean;
  onChange?: (value: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  helperText?: string;
  isDisabled?: boolean;
  required?: boolean;
  errorText?: string;
}
