export type UiTheme = 'light' | 'dark' | 'system';

export type UiSize = 'sm' | 'md' | 'lg';

export type UiVariant =
  'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';

export interface UiLibraryConfig {
  theme: UiTheme;
  defaultSize: UiSize;
  animation: boolean;
  ripple: boolean;
}

export const DEFAULT_UI_CONFIG: UiLibraryConfig = {
  theme: 'light',
  defaultSize: 'md',
  animation: true,
  ripple: false,
};
