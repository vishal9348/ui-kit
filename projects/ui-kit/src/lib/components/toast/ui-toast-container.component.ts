import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UiToastService } from './ui-toast.service';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  templateUrl: './ui-toast-container.component.html',
  styleUrl: './ui-toast-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiToastContainerComponent {
  readonly toastService = inject(UiToastService);

  readonly toasts = this.toastService.toasts;

  readonly position = this.toastService.position;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  pause(id: number): void {
    this.toastService.pause(id);
  }

  resume(id: number): void {
    this.toastService.resume(id);
  }
}
