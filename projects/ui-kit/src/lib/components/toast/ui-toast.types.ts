export type UiToastVariant = 'success' | 'error' | 'warning' | 'info';

export type UiToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface UiToastConfig {
  title?: string;
  message: string;
  variant?: UiToastVariant;
  duration?: number;
  closable?: boolean;
}

export interface UiToast extends UiToastConfig {
  id: number;
  variant: UiToastVariant;
  duration: number;
  closable: boolean;
}
