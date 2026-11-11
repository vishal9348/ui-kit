export type UiInputSize = 'sm' | 'md' | 'lg';

export type UiInputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

export interface UiInputConfig {
  label?: string;
  placeholder?: string;
  type?: UiInputType;
  size?: UiInputSize;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  prefix?: string;
  suffix?: string;
  hint?: string;
  error?: string;
  showPasswordToggle?: boolean;
}
