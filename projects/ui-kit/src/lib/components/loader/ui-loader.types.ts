export type UiLoaderSize = 'sm' | 'md' | 'lg';

export type UiLoaderVariant = 'primary' | 'secondary' | 'light' | 'dark';

export interface UiLoaderConfig {
  size?: UiLoaderSize;
  variant?: UiLoaderVariant;
  text?: string;
  overlay?: boolean;
  fullscreen?: boolean;
  visible?: boolean;
}
