export type UiDialogVariant = 'info' | 'success' | 'warning' | 'danger';

export type UiDialogMode = 'alert' | 'confirm';

export type UiDialogSize = 'sm' | 'md' | 'lg';

export interface UiDialogConfig {
  title?: string;
  message?: string;
  variant?: UiDialogVariant;
  mode?: UiDialogMode;
  size?: UiDialogSize;
  confirmText?: string;
  cancelText?: string;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  loading?: boolean;
}
