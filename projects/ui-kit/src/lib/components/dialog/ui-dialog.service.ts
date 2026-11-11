import { Injectable, inject } from '@angular/core';

import { Dialog, DialogRef } from '@angular/cdk/dialog';

import { UiDialogComponent } from './ui-dialog.component';
import { UiDialogConfig } from './ui-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class UiDialogService {
  private readonly dialog = inject(Dialog);

  alert(config: Omit<UiDialogConfig, 'mode'>): DialogRef<boolean, UiDialogComponent> {
    return this.open({
      ...config,
      mode: 'alert',
    });
  }

  confirm(config: Omit<UiDialogConfig, 'mode'>): DialogRef<boolean, UiDialogComponent> {
    return this.open({
      ...config,
      mode: 'confirm',
    });
  }

  private open(config: UiDialogConfig): DialogRef<boolean, UiDialogComponent> {
    return this.dialog.open<boolean, UiDialogConfig, UiDialogComponent>(UiDialogComponent, {
      data: config,
      hasBackdrop: true,
      backdropClass: 'ui-dialog-cdk-backdrop',
      panelClass: 'ui-dialog-cdk-panel',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      ariaLabel: config.title ?? 'Dialog',
      role: config.mode === 'confirm' ? 'alertdialog' : 'dialog',
      disableClose: !(config.closeOnBackdrop ?? true),
    });
  }
}
