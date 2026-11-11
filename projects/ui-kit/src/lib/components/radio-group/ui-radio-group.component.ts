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

import {
  UiRadioGroupConfig,
  UiRadioOption,
  UiRadioOrientation,
  UiRadioSize,
} from './ui-radio-group.types';

@Component({
  selector: 'ui-radio-group',
  standalone: true,
  templateUrl: './ui-radio-group.component.html',
  styleUrl: './ui-radio-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiRadioGroupComponent),
      multi: true,
    },
  ],
})
export class UiRadioGroupComponent implements ControlValueAccessor {
  private static nextId = 0;

  private readonly generatedId = `ui-radio-group-${++UiRadioGroupComponent.nextId}`;

  // Inputs
  readonly options = input<UiRadioOption[]>([]);

  readonly config = input<UiRadioGroupConfig>({});

  readonly value = input<unknown | undefined>(undefined);

  readonly label = input<string | undefined>();

  readonly description = input<string | undefined>();

  readonly size = input<UiRadioSize | undefined>();

  readonly orientation = input<UiRadioOrientation | undefined>();

  readonly disabled = input<boolean | undefined>();

  readonly required = input<boolean | undefined>();

  readonly name = input<string | undefined>();

  readonly ariaLabel = input<string | undefined>();

  readonly compareWith = input<(first: unknown, second: unknown) => boolean>((first, second) =>
    Object.is(first, second),
  );

  // Outputs
  readonly valueChange = output<unknown>();

  // Internal state
  private readonly internalValue = signal<unknown>(null);

  private readonly formDisabled = signal(false);

  private onChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  // Resolved configuration
  readonly selectedValue = computed(() =>
    this.value() !== undefined ? this.value() : this.internalValue(),
  );

  readonly resolvedLabel = computed(() => this.label() ?? this.config().label ?? '');

  readonly resolvedDescription = computed(
    () => this.description() ?? this.config().description ?? '',
  );

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly resolvedOrientation = computed(
    () => this.orientation() ?? this.config().orientation ?? 'vertical',
  );

  readonly isDisabled = computed(
    () => this.formDisabled() || (this.disabled() ?? this.config().disabled ?? false),
  );

  readonly isRequired = computed(() => this.required() ?? this.config().required ?? false);

  readonly resolvedName = computed(() => this.name() ?? this.config().name ?? this.generatedId);

  readonly groupId = this.generatedId;

  readonly descriptionId = `${this.generatedId}-description`;

  // Selection
  isSelected(optionValue: unknown): boolean {
    return this.compareWith()(this.selectedValue(), optionValue);
  }

  selectOption(option: UiRadioOption): void {
    if (this.isDisabled() || option.disabled) {
      return;
    }

    this.internalValue.set(option.value);

    this.onChange(option.value);

    this.valueChange.emit(option.value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor
  writeValue(value: unknown): void {
    this.internalValue.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  optionId(index: number): string {
    return `${this.generatedId}-option-${index}`;
  }
}
