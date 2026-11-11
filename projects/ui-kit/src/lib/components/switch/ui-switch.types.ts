export type UiSwitchSize = 'sm' | 'md' | 'lg';

export interface UiSwitchConfig {
  label?: string;
  description?: string;
  size?: UiSwitchSize;
  disabled?: boolean;
  required?: boolean;
  // checked?: boolean;
}
