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

import { UiTextareaConfig, UiTextareaResize, UiTextareaSize } from './ui-textarea.types';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  templateUrl: './ui-textarea.component.html',
  styleUrl: './ui-textarea.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiTextareaComponent),
      multi: true,
    },
  ],
})
export class UiTextareaComponent implements ControlValueAccessor {
  readonly config = input<UiTextareaConfig>({});

    readonly value = input<string | undefined>();
  readonly valueChange = output<string>();

  readonly label = input<string | undefined>();

  readonly placeholder = input<string | undefined>();

  readonly size = input<UiTextareaSize | undefined>();

  readonly rows = input<number | undefined>();

  readonly minRows = input<number | undefined>();

  readonly maxRows = input<number | undefined>();

  readonly minLength = input<number | undefined>();

  readonly maxLength = input<number | undefined>();

  readonly resize = input<UiTextareaResize | undefined>();

  readonly disabled = input<boolean | undefined>();

  readonly readonly = input<boolean | undefined>();

  readonly required = input<boolean | undefined>();

  readonly showCounter = input<boolean | undefined>();

  readonly hint = input<string | undefined>();

  readonly error = input<string | undefined>();

  readonly id = input<string | undefined>();

  readonly name = input<string | undefined>();

  // readonly valueChange = input<string | undefined>();

  readonly internalValue = signal('');

  readonly formDisabled = signal(false);

  private onChange: (value: string) => void = () => {};

  private onTouched: () => void = () => {};

  readonly resolvedValue = computed(() => this.value() ?? this.internalValue());

  readonly characterCount = computed(() => this.resolvedValue().length);

  readonly resolvedLabel = computed(() => this.label() ?? this.config().label ?? '');

  readonly resolvedPlaceholder = computed(
    () => this.placeholder() ?? this.config().placeholder ?? '',
  );

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly resolvedRows = computed(() => this.rows() ?? this.config().rows ?? 4);

  readonly resolvedMinRows = computed(() => this.minRows() ?? this.config().minRows ?? 2);

  readonly resolvedMaxRows = computed(() => this.maxRows() ?? this.config().maxRows ?? 8);

  readonly resolvedMinLength = computed(() => this.minLength() ?? this.config().minLength ?? null);

  readonly resolvedMaxLength = computed(() => this.maxLength() ?? this.config().maxLength ?? null);

  readonly resolvedResize = computed(() => this.resize() ?? this.config().resize ?? 'vertical');

  readonly resolvedDisabled = computed(
    () => this.formDisabled() || (this.disabled() ?? this.config().disabled ?? false),
  );

  readonly resolvedReadonly = computed(() => this.readonly() ?? this.config().readonly ?? false);

  readonly resolvedRequired = computed(() => this.required() ?? this.config().required ?? false);

  readonly resolvedShowCounter = computed(
    () => this.showCounter() ?? this.config().showCounter ?? false,
  );

  readonly resolvedHint = computed(() => this.hint() ?? this.config().hint ?? '');

  readonly resolvedError = computed(() => this.error() ?? this.config().error ?? '');

  handleInput(event: Event): void {
    const nextValue = (event.target as HTMLTextAreaElement).value;

    this.internalValue.set(nextValue);
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
  }

  handleBlur(): void {
    this.onTouched();
  }

  writeValue(value: string | null): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }
}
