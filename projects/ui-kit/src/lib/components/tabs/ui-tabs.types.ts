export type UiTabsVariant = 'default' | 'underline' | 'pills';

export type UiTabsOrientation = 'horizontal' | 'vertical';

export type UiTabsSize = 'sm' | 'md' | 'lg';

export interface UiTab {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

export interface UiTabsConfig {
  variant?: UiTabsVariant;
  orientation?: UiTabsOrientation;
  size?: UiTabsSize;
  ariaLabel?: string;
}
