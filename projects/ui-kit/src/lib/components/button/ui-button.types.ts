
import {
  UiSize,
  UiVariant,
} from '../../core/config/ui-config';

export type UiButtonType = 'button' | 'submit' | 'reset';

export interface UiButtonConfig {
  variant?: UiVariant;
  size?: UiSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}
