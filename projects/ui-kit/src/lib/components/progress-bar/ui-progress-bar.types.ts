export type UiProgressSize = 'sm' | 'md' | 'lg';

export type UiProgressVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface UiProgressBarConfig {
  value?: number;
  min?: number;
  max?: number;
  size?: UiProgressSize;
  variant?: UiProgressVariant;
  label?: string;
  showValue?: boolean;
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
}
