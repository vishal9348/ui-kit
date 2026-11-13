import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  HostListener,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UiSelectOption } from './ui-select.types';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-select.component.html',
  styleUrl: './ui-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true,
    },
  ],
})
export class UiSelectComponent implements ControlValueAccessor {
  readonly options = input<UiSelectOption[]>([]);
  readonly placeholder = input('Select an option');
  readonly searchable = input(false);
  readonly clearable = input(false);
  readonly disabled = input(false);
  readonly required = input(false);
  readonly label = input('');
  //   readonly id = input(`ui-select-${Math.random().toString(36).slice(2, 9)}`);
  readonly id = input('ui-select');
  readonly noResultsText = input('No options found');

  readonly valueChange = output<string | number | null>();

  readonly isOpen = signal(false);
  readonly searchTerm = signal('');
  readonly selectedValue = signal<string | number | null>(null);
  readonly activeIndex = signal(-1);
  readonly formDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly selectedOption = computed(
    () => this.options().find((option) => option.value === this.selectedValue()) ?? null,
  );

  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) return this.options();

    return this.options().filter((option) => option.label.toLowerCase().includes(term));
  });

  readonly displayText = computed(() => this.selectedOption()?.label ?? this.placeholder());

  private onChange: (value: string | number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | number | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
    if (isDisabled) this.close();
  }

  toggle(): void {
    if (this.isDisabled()) return;

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isDisabled()) return;

    this.isOpen.set(true);
    this.searchTerm.set('');

    const selectedIndex = this.filteredOptions().findIndex(
      (option) => option.value === this.selectedValue(),
    );

    this.activeIndex.set(selectedIndex >= 0 ? selectedIndex : this.findEnabledIndex(0, 1));
  }

  close(): void {
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.activeIndex.set(-1);
    this.onTouched();
  }

  selectOption(option: UiSelectOption): void {
    if (option.disabled) return;

    this.selectedValue.set(option.value);
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.close();
  }

  clear(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isDisabled()) return;

    this.selectedValue.set(null);
    this.onChange(null);
    this.valueChange.emit(null);
    this.onTouched();
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.activeIndex.set(this.findEnabledIndex(0, 1));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement && event.key === ' ') {
      return;
    }
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isOpen()) {
          this.open();
        } else {
          this.moveActiveIndex(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();

        if (!this.isOpen()) {
          this.open();
        } else {
          this.moveActiveIndex(-1);
        }
        break;

      case 'Enter':
      case ' ':
        if (!this.isOpen()) {
          event.preventDefault();
          this.open();
        } else {
          event.preventDefault();
          this.selectActiveOption();
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;

      case 'Home':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(this.findEnabledIndex(0, 1));
        }
        break;

      case 'End':
        if (this.isOpen()) {
          event.preventDefault();
          this.activeIndex.set(this.findEnabledIndex(this.filteredOptions().length - 1, -1));
        }
        break;

      case 'Tab':
        if (this.isOpen()) this.close();
        break;
    }
  }

  isSelected(option: UiSelectOption): boolean {
    return option.value === this.selectedValue();
  }

  private selectActiveOption(): void {
    const option = this.filteredOptions()[this.activeIndex()];

    if (option && !option.disabled) {
      this.selectOption(option);
    }
  }

  private moveActiveIndex(direction: 1 | -1): void {
    const nextIndex = this.findEnabledIndex(this.activeIndex() + direction, direction);

    if (nextIndex >= 0) this.activeIndex.set(nextIndex);
  }

  private findEnabledIndex(startIndex: number, direction: 1 | -1): number {
    const options = this.filteredOptions();

    for (let index = startIndex; index >= 0 && index < options.length; index += direction) {
      if (!options[index].disabled) return index;
    }

    return -1;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('ui-select')) {
      if (this.isOpen()) this.close();
    }
  }
}
