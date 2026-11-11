
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideUiKit } from 'ui-kit';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideUiKit({
      theme: 'light',
      defaultSize: 'md',
      animation: true,
      ripple: false,
    }),
  ],
};
