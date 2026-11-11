import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UiCheckboxChange, UiCheckboxConfig, UiCheckboxSize } from './ui-checkbox.types';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  templateUrl: './ui-checkbox.component.html',
  styleUrl: './ui-checkbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiCheckboxComponent),
      multi: true,
    },
  ],
})
export class UiCheckboxComponent implements ControlValueAccessor {
  // Public inputs

  readonly config = input<UiCheckboxConfig>({});

  readonly checked = input<boolean | undefined>();

  readonly indeterminate = input<boolean | undefined>();

  readonly disabled = input<boolean | undefined>();

  readonly required = input<boolean | undefined>();

  readonly label = input<string | undefined>();

  readonly description = input<string | undefined>();

  readonly size = input<UiCheckboxSize | undefined>();

  readonly id = input<string>();

  readonly ariaLabel = input<string>();

  // Outputs

  readonly checkedChange = output<boolean>();

  readonly changed = output<UiCheckboxChange>();

  // Internal state

  readonly internalChecked = signal(false);

  readonly internalIndeterminate = signal(false);

  readonly isFormDisabled = signal(false);

  private onChange: (value: boolean) => void = () => {};

  private onTouched: () => void = () => {};

  // Resolved configuration
  // Priority: Direct input -> Config -> Default value

  readonly isChecked = computed(() => this.checked() ?? this.internalChecked());

  readonly isIndeterminate = computed(
    () => this.indeterminate() ?? this.config().indeterminate ?? this.internalIndeterminate(),
  );

  readonly isDisabled = computed(
    () => this.isFormDisabled() || (this.disabled() ?? this.config().disabled ?? false),
  );

  readonly isRequired = computed(() => this.required() ?? this.config().required ?? false);

  readonly resolvedLabel = computed(() => this.label() ?? this.config().label ?? '');

  readonly resolvedDescription = computed(
    () => this.description() ?? this.config().description ?? '',
  );

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly descriptionId = computed(() => {
    const id = this.id();
    return id ? `${id}-description` : null;
  });

  // ControlValueAccessor

  writeValue(value: unknown): void {
    this.internalChecked.set(value === true);
    this.internalIndeterminate.set(false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isFormDisabled.set(disabled);
  }

  // Checkbox interaction

  handleChange(event: Event): void {
    if (this.isDisabled()) {
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;

    this.internalChecked.set(checked);
    this.internalIndeterminate.set(false);

    // Notify Angular Forms
    this.onChange(checked);

    // Notify component consumers
    this.checkedChange.emit(checked);

    this.changed.emit({
      checked,
      indeterminate: false,
    });
  }

  handleBlur(): void {
    this.onTouched();
  }
}
