import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
  FormControl,
} from '@angular/forms';

import { UiInputConfig, UiInputSize, UiInputType } from './ui-input.types';

@Component({
  selector: 'ui-input',
  standalone: true,
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
})
export class UiInputComponent implements ControlValueAccessor, Validator {
  readonly config = input<UiInputConfig>({});

  readonly value = input<string | number | undefined>();

  readonly label = input<string | undefined>();
  readonly placeholder = input<string | undefined>();
  readonly type = input<UiInputType | undefined>();
  readonly size = input<UiInputSize | undefined>();
  readonly disabled = input<boolean | undefined>();
  readonly required = input<boolean | undefined>();
  readonly readonly = input<boolean | undefined>();

  readonly minLength = input<number | undefined>();
  readonly maxLength = input<number | undefined>();
  readonly pattern = input<string | undefined>();

  readonly prefix = input<string | undefined>();
  readonly suffix = input<string | undefined>();
  readonly hint = input<string | undefined>();
  readonly error = input<string | undefined>();

  readonly id = input<string | undefined>();
  readonly name = input<string | undefined>();

  readonly showPasswordToggle = input<boolean | undefined>();

  readonly valueChange = output<string | number>();

  readonly internalValue = signal<string | number>('');
  readonly formDisabled = signal(false);
  readonly passwordVisible = signal(false);
  readonly touched = signal(false);

  private onChange: (value: string | number) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  readonly resolvedType = computed(() => this.type() ?? this.config().type ?? 'text');

  readonly inputType = computed(() =>
    this.resolvedType() === 'password' && this.passwordVisible() ? 'text' : this.resolvedType(),
  );

  readonly resolvedValue = computed(() =>
    this.value() !== undefined ? this.value()! : this.internalValue(),
  );

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly resolvedLabel = computed(() => this.label() ?? this.config().label ?? '');

  readonly resolvedPlaceholder = computed(
    () => this.placeholder() ?? this.config().placeholder ?? '',
  );

  readonly resolvedDisabled = computed(
    () => this.formDisabled() || (this.disabled() ?? this.config().disabled ?? false),
  );

  readonly resolvedRequired = computed(() => this.required() ?? this.config().required ?? false);

  readonly resolvedReadonly = computed(() => this.readonly() ?? this.config().readonly ?? false);

  readonly resolvedMinLength = computed(() => this.minLength() ?? this.config().minLength);

  readonly resolvedMaxLength = computed(() => this.maxLength() ?? this.config().maxLength);

  readonly resolvedPattern = computed(() => this.pattern() ?? this.config().pattern);

  readonly resolvedPrefix = computed(() => this.prefix() ?? this.config().prefix ?? '');

  readonly resolvedSuffix = computed(() => this.suffix() ?? this.config().suffix ?? '');

  readonly resolvedHint = computed(() => this.hint() ?? this.config().hint ?? '');

  readonly resolvedError = computed(() => {
    // Explicit custom error always takes priority.
    const customError = this.error() ?? this.config().error;

    if (customError) {
      return customError;
    }

    if (!this.touched() || this.resolvedDisabled()) {
      return '';
    }

    const validationErrors = this.getValidationErrors(this.resolvedValue());

    if (validationErrors?.['required']) {
      return 'This field is required.';
    }

    if (validationErrors?.['email']) {
      return 'Please enter a valid email address.';
    }

    if (validationErrors?.['minlength']) {
      return `Minimum ${this.resolvedMinLength()} characters required.`;
    }

    if (validationErrors?.['maxlength']) {
      return `Maximum ${this.resolvedMaxLength()} characters allowed.`;
    }

    if (validationErrors?.['pattern']) {
      return 'Please enter a value in the required format.';
    }

    return '';
  });

  readonly canTogglePassword = computed(
    () =>
      this.resolvedType() === 'password' &&
      (this.showPasswordToggle() ?? this.config().showPasswordToggle ?? true),
  );

  constructor() {
    // Notify Angular Forms whenever validation configuration changes.
    effect(() => {
      this.resolvedType();
      this.resolvedRequired();
      this.resolvedMinLength();
      this.resolvedMaxLength();
      this.resolvedPattern();

      this.onValidatorChange();
    });
  }

  handleInput(event: Event): void {
    const element = event.target as HTMLInputElement;

    const nextValue =
      this.resolvedType() === 'number'
        ? element.value === ''
          ? ''
          : element.valueAsNumber
        : element.value;

    this.internalValue.set(nextValue);
    this.onChange(nextValue);
    this.valueChange.emit(nextValue);
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  togglePassword(): void {
    this.passwordVisible.update((value) => !value);
  }

  writeValue(value: string | number | null): void {
    this.internalValue.set(value ?? '');
    this.touched.set(false);
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.resolvedDisabled()) {
      return null;
    }

    return this.getValidationErrors(control.value);
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private getValidationErrors(value: unknown): ValidationErrors | null {
    const validators = [];

    if (this.resolvedRequired()) {
      validators.push(Validators.required);
    }

    if (this.resolvedType() === 'email') {
      validators.push(Validators.email);
    }

    const min = this.resolvedMinLength();

    if (min !== undefined && min >= 0) {
      validators.push(Validators.minLength(min));
    }

    const max = this.resolvedMaxLength();

    if (max !== undefined && max >= 0) {
      validators.push(Validators.maxLength(max));
    }

    const pattern = this.resolvedPattern();

    if (pattern) {
      validators.push(Validators.pattern(pattern));
    }

    // const control = { value } as AbstractControl;
    const control = new FormControl(value);

    for (const validator of validators) {
      const errors = validator(control);

      if (errors) {
        return errors;
      }
    }

    return null;
  }
}
