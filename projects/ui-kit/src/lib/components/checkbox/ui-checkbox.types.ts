export type UiCheckboxSize = 'sm' | 'md' | 'lg';

export interface UiCheckboxConfig {
  size?: UiCheckboxSize;
  disabled?: boolean;
  indeterminate?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
}

export interface UiCheckboxChange {
  checked: boolean;
  indeterminate: boolean;
}
