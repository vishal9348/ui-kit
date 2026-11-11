export type UiRadioSize = 'sm' | 'md' | 'lg';

export type UiRadioOrientation = 'horizontal' | 'vertical';

export interface UiRadioOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
  description?: string;
}

export interface UiRadioGroupConfig {
  label?: string;
  description?: string;
  size?: UiRadioSize;
  orientation?: UiRadioOrientation;
  disabled?: boolean;
  required?: boolean;
  name?: string;
}
