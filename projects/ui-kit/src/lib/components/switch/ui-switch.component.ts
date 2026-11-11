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

import { UiSwitchConfig, UiSwitchSize } from './ui-switch.types';

@Component({
  selector: 'ui-switch',
  standalone: true,
  templateUrl: './ui-switch.component.html',
  styleUrl: './ui-switch.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSwitchComponent),
      multi: true,
    },
  ],
})
export class UiSwitchComponent implements ControlValueAccessor {
  readonly config = input<UiSwitchConfig>({});

  readonly checked = input<boolean | undefined>();

  readonly label = input<string | undefined>();

  readonly description = input<string | undefined>();

  readonly size = input<UiSwitchSize | undefined>();

  readonly disabled = input<boolean | undefined>();

  readonly required = input<boolean | undefined>();

  readonly id = input<string | undefined>();

  readonly name = input<string | undefined>();

  readonly checkedChange = output<boolean>();

  readonly internalChecked = signal(false);

  readonly formDisabled = signal(false);

  private onChange: (value: boolean) => void = () => {};

  private onTouched: () => void = () => {};

  readonly isChecked = computed(() => this.checked() ?? this.internalChecked());

  readonly resolvedLabel = computed(() => this.label() ?? this.config().label ?? '');

  readonly resolvedDescription = computed(
    () => this.description() ?? this.config().description ?? '',
  );

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly isDisabled = computed(
    () => this.formDisabled() || (this.disabled() ?? this.config().disabled ?? false),
  );

  readonly isRequired = computed(() => this.required() ?? this.config().required ?? false);

  handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    const checked = inputElement.checked;

    this.internalChecked.set(checked);

    this.onChange(checked);

    this.checkedChange.emit(checked);
  }

  handleBlur(): void {
    this.onTouched();
  }

  writeValue(value: boolean | null): void {
    this.internalChecked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
