export interface UiDropdownOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

export interface UiDropdownConfig {
  placeholder?: string;
  searchPlaceholder?: string;

  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;

  disabled?: boolean;
  loading?: boolean;

  size?: 'sm' | 'md' | 'lg';

  maxHeight?: number;

  emptyMessage?: string;
  loadingMessage?: string;
}

export type UiDropdownSelection<T = unknown> = T | T[] | null;
