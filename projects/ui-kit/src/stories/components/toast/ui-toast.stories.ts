import { Component, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { UiToastContainerComponent } from '../../../lib/components/toast/ui-toast-container.component';
import { UiToastService } from '../../../lib/components/toast/ui-toast.service';

@Component({
  selector: 'storybook-toast-demo',
  standalone: true,
  imports: [UiToastContainerComponent],
  template: `
    <div style="display:flex;gap:12px;flex-wrap:wrap;padding:24px">
      <button (click)="toast.success('Record saved successfully.')">Success</button>

      <button (click)="toast.error('Unable to save record.')">Error</button>

      <button (click)="toast.warning('Please check your input.')">Warning</button>

      <button (click)="toast.info('New update available.')">Info</button>
    </div>

    <ui-toast-container />
  `,
})
class ToastStoryComponent {
  readonly toast = inject(UiToastService);
}

const meta: Meta<ToastStoryComponent> = {
  title: 'Components/Toast',
  component: ToastStoryComponent,
  decorators: [
    applicationConfig({
      providers: [UiToastService],
    }),
  ],
};

export default meta;

type Story = StoryObj<ToastStoryComponent>;

export const Notifications: Story = {};
