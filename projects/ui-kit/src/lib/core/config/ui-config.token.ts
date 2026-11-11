import { InjectionToken } from '@angular/core';
import { DEFAULT_UI_CONFIG, UiLibraryConfig } from './ui-config';

export const UI_LIBRARY_CONFIG = new InjectionToken<UiLibraryConfig>('UI_LIBRARY_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_UI_CONFIG,
});
