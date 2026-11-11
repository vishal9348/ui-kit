export type UiTextareaSize = 'sm' | 'md' | 'lg';

export type UiTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface UiTextareaConfig {
  label?: string;
  placeholder?: string;
  size?: UiTextareaSize;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  minLength?: number;
  maxLength?: number;
  resize?: UiTextareaResize;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  showCounter?: boolean;
  hint?: string;
  error?: string;
}
