
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';

import {
  UI_LIBRARY_CONFIG,
} from '../../core/config/ui-config.token';

import {
  UiSize,
  UiVariant,
} from '../../core/config/ui-config';

import {
  UiButtonConfig,
  UiButtonType,
} from './ui-button.types';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      class="ui-button"
      [class.ui-button--primary]="resolvedVariant() === 'primary'"
      [class.ui-button--secondary]="resolvedVariant() === 'secondary'"
      [class.ui-button--success]="resolvedVariant() === 'success'"
      [class.ui-button--warning]="resolvedVariant() === 'warning'"
      [class.ui-button--danger]="resolvedVariant() === 'danger'"
      [class.ui-button--outline]="resolvedVariant() === 'outline'"
      [class.ui-button--ghost]="resolvedVariant() === 'ghost'"
      [class.ui-button--sm]="resolvedSize() === 'sm'"
      [class.ui-button--md]="resolvedSize() === 'md'"
      [class.ui-button--lg]="resolvedSize() === 'lg'"
      [class.ui-button--full-width]="resolvedFullWidth()"
      [class.ui-button--icon-only]="iconOnly()"
      [disabled]="isDisabled()"
      [type]="type()"
      [attr.aria-label]="accessibleName()"
      [attr.aria-busy]="loading() ? 'true' : null"
      (click)="handleClick()"
    >
      @if (loading()) {
        <span
          class="ui-button__spinner"
          aria-hidden="true"
        ></span>
      }

      <!-- <ng-content select="[uiButtonIcon]"></ng-content> -->

      <span class="ui-button__icon">
  <ng-content select="[uiButtonIcon]"></ng-content>
</span>

      @if (!iconOnly()) {
        <span class="ui-button__content">
          <ng-content>
            {{ label() }}
          </ng-content>
        </span>
      }
    </button>
  `,
  styleUrl: './ui-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiButtonComponent {
  private readonly globalConfig = inject(UI_LIBRARY_CONFIG);

  // Configuration object
  readonly config = input<UiButtonConfig>({});

  // Direct inputs
  readonly variant = input<UiVariant | undefined>();

  readonly size = input<UiSize | undefined>();

  readonly disabled = input<boolean | undefined>();

  readonly loadingInput = input<boolean | undefined>(
  undefined,
  { alias: 'loading' }
);

  readonly fullWidth = input<boolean | undefined>();

  readonly iconOnly = input(false);

  readonly label = input('');

  readonly ariaLabel = input<string>();

  readonly type = input<UiButtonType>('button');

  // Output
  readonly clicked = output<MouseEvent>();

  // Resolved configuration
  readonly resolvedVariant = computed(
    () =>
      this.variant() ??
      this.config().variant ??
      'primary'
  );

  readonly resolvedSize = computed(
    () =>
      this.size() ??
      this.config().size ??
      this.globalConfig.defaultSize
  );

  readonly loading = computed(
    () =>
      this.loadingInput() ??
      this.config().loading ??
      false
  );

  readonly isDisabled = computed(
    () =>
      (this.disabled() ??
        this.config().disabled ??
        false) ||
      this.loading()
  );

  readonly resolvedFullWidth = computed(
    () =>
      this.fullWidth() ??
      this.config().fullWidth ??
      false
  );

  readonly accessibleName = computed(
    () => this.ariaLabel() || this.label() || null
  );

  handleClick(event?: MouseEvent): void {
    if (this.isDisabled()) {
      return;
    }

    if (event) {
      this.clicked.emit(event);
    }
  }
}
