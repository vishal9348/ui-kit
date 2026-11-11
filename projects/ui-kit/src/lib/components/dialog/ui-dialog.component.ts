import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { UiDialogConfig } from './ui-dialog.types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './ui-dialog.component.html',
  styleUrl: './ui-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDialogComponent {
  private readonly injectedConfig = inject(DIALOG_DATA, {
    optional: true,
  }) as UiDialogConfig | null;

  private readonly dialogRef = inject(DialogRef, { optional: true });

  // Inputs
  readonly open = input(false);

  readonly config = input<UiDialogConfig>({});

  readonly title = input<string | undefined>();

  readonly message = input<string | undefined>();

  readonly variant = input<UiDialogConfig['variant']>();

  readonly mode = input<UiDialogConfig['mode']>();

  readonly size = input<UiDialogConfig['size']>();

  readonly confirmText = input<string | undefined>();

  readonly cancelText = input<string | undefined>();

  readonly closeOnBackdrop = input<boolean | undefined>();

  readonly showCloseButton = input<boolean | undefined>();

  readonly loading = input<boolean | undefined>();

  // Outputs
  readonly confirmed = output<void>();

  readonly cancelled = output<void>();

  readonly closed = output<void>();

  // Resolved configuration
  readonly resolvedTitle = computed(
    () => this.title() ?? this.config().title ?? this.injectedConfig?.title ?? 'Information',
  );

  readonly resolvedMessage = computed(
    () => this.message() ?? this.config().message ?? this.injectedConfig?.message ?? '',
  );

  readonly resolvedVariant = computed(
    () => this.variant() ?? this.config().variant ?? this.injectedConfig?.variant ?? 'info',
  );

  readonly resolvedMode = computed(
    () => this.mode() ?? this.config().mode ?? this.injectedConfig?.mode ?? 'alert',
  );

  readonly resolvedSize = computed(
    () => this.size() ?? this.config().size ?? this.injectedConfig?.size ?? 'md',
  );

  readonly resolvedConfirmText = computed(
    () =>
      this.confirmText() ?? this.config().confirmText ?? this.injectedConfig?.confirmText ?? 'OK',
  );

  readonly resolvedCancelText = computed(
    () =>
      this.cancelText() ?? this.config().cancelText ?? this.injectedConfig?.cancelText ?? 'Cancel',
  );

  readonly isLoading = computed(
    () => this.loading() ?? this.config().loading ?? this.injectedConfig?.loading ?? false,
  );

  readonly canCloseOnBackdrop = computed(
    () =>
      this.closeOnBackdrop() ??
      this.config().closeOnBackdrop ??
      this.injectedConfig?.closeOnBackdrop ??
      true,
  );

  readonly hasCloseButton = computed(
    () =>
      this.showCloseButton() ??
      this.config().showCloseButton ??
      this.injectedConfig?.showCloseButton ??
      true,
  );

  readonly isServiceDialog = this.dialogRef !== null;

  readonly isVisible = computed(() => this.isServiceDialog || this.open());

  confirm(): void {
    if (this.isLoading()) {
      return;
    }

    this.confirmed.emit();
    this.dialogRef?.close(true);
  }

  cancel(): void {
    if (this.isLoading()) {
      return;
    }

    this.cancelled.emit();
    this.dialogRef?.close(false);
  }

  close(): void {
    if (this.isLoading()) {
      return;
    }

    this.closed.emit();
    this.dialogRef?.close(false);
  }

  handleBackdropClick(event: MouseEvent): void {
    if (
      event.target === event.currentTarget &&
      this.canCloseOnBackdrop() &&
      !this.isServiceDialog
    ) {
      this.close();
    }
  }
}
