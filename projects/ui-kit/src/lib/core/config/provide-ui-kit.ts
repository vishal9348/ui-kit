import { makeEnvironmentProviders } from '@angular/core';
import { DEFAULT_UI_CONFIG, UiLibraryConfig } from './ui-config';
import { UI_LIBRARY_CONFIG } from './ui-config.token';

export function provideUiKit(config: Partial<UiLibraryConfig> = {}) {
  return makeEnvironmentProviders([
    {
      provide: UI_LIBRARY_CONFIG,
      useValue: {
        ...DEFAULT_UI_CONFIG,
        ...config,
      },
    },
  ]);
}
