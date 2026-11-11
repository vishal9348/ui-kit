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

import { OverlayModule } from '@angular/cdk/overlay';

import { UiDropdownConfig, UiDropdownOption, UiDropdownSelection } from './ui-dropdown.types';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDropdownComponent),
      multi: true,
    },
  ],
})
export class UiDropdownComponent implements ControlValueAccessor {
  // Public inputs

  readonly options = input<UiDropdownOption[]>([]);

  readonly config = input<UiDropdownConfig>({});

  readonly placeholder = input<string>();

  readonly multiple = input<boolean | undefined>();

  readonly searchable = input<boolean | undefined>();

  readonly clearable = input<boolean | undefined>();

  readonly disabled = input<boolean | undefined>();

  readonly loading = input<boolean | undefined>();

  readonly selectionChange = output<UiDropdownSelection>();

  // Internal state

  readonly isOpen = signal(false);

  readonly searchTerm = signal('');

  readonly selectedValue = signal<unknown>(null);

  readonly activeIndex = signal(-1);

  readonly isFormDisabled = signal(false);

  private onChange: (value: unknown) => void = () => {};

  private onTouched: () => void = () => {};

  // Resolved configuration

  readonly isMultiple = computed(() => this.multiple() ?? this.config().multiple ?? false);

  readonly isSearchable = computed(() => this.searchable() ?? this.config().searchable ?? false);

  readonly isClearable = computed(() => this.clearable() ?? this.config().clearable ?? false);

  readonly isDisabled = computed(
    () => this.isFormDisabled() || (this.disabled() ?? this.config().disabled ?? false),
  );

  readonly isLoading = computed(() => this.loading() ?? this.config().loading ?? false);

  readonly resolvedPlaceholder = computed(
    () => this.placeholder() ?? this.config().placeholder ?? 'Select an option',
  );

  readonly resolvedSearchPlaceholder = computed(
    () => this.config().searchPlaceholder ?? 'Search options...',
  );

  readonly resolvedSize = computed(() => this.config().size ?? 'md');

  readonly resolvedMaxHeight = computed(() => this.config().maxHeight ?? 240);

  readonly resolvedEmptyMessage = computed(() => this.config().emptyMessage ?? 'No options found');

  readonly resolvedLoadingMessage = computed(
    () => this.config().loadingMessage ?? 'Loading options...',
  );

  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.options();
    }

    return this.options().filter((option) => option.label.toLowerCase().includes(term));
  });

  readonly selectedOptions = computed(() => {
    const value = this.selectedValue();

    if (this.isMultiple()) {
      return Array.isArray(value) ? value : [];
    }

    return value === null ? [] : [value];
  });

  readonly selectedLabel = computed(() => {
    if (this.isMultiple()) {
      const selected = this.selectedOptions();

      if (!selected.length) {
        return '';
      }

      const labels = this.options()
        .filter((option) => selected.some((value) => this.isEqual(value, option.value)))
        .map((option) => option.label);

      return labels.join(', ');
    }

    const selected = this.options().find((option) =>
      this.isEqual(option.value, this.selectedValue()),
    );

    return selected?.label ?? '';
  });

  readonly hasSelection = computed(() => this.selectedOptions().length > 0);

  // ControlValueAccessor implementation

  writeValue(value: unknown): void {
    this.selectedValue.set(value ?? null);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isFormDisabled.set(disabled);
  }

  // Dropdown interactions

  toggleDropdown(): void {
    if (this.isDisabled() || this.isLoading()) {
      return;
    }

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    if (this.isDisabled() || this.isLoading()) {
      return;
    }

    this.searchTerm.set('');
    this.activeIndex.set(this.findInitialActiveIndex());
    this.isOpen.set(true);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.activeIndex.set(-1);
    this.onTouched();
  }

  selectOption(option: UiDropdownOption): void {
    if (option.disabled || this.isDisabled()) {
      return;
    }

    if (this.isMultiple()) {
      const current = [...this.selectedOptions()];

      const index = current.findIndex((value) => this.isEqual(value, option.value));

      if (index >= 0) {
        current.splice(index, 1);
      } else {
        current.push(option.value);
      }

      this.updateValue(current);
    } else {
      this.updateValue(option.value);
      this.closeDropdown();
    }
  }

  clearSelection(event?: Event): void {
    event?.stopPropagation();

    if (this.isDisabled()) {
      return;
    }

    this.updateValue(this.isMultiple() ? [] : null);
  }

  isSelected(value: unknown): boolean {
    return this.selectedOptions().some((selected) => this.isEqual(selected, value));
  }

  // Search

  updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.activeIndex.set(this.findInitialActiveIndex());
  }

  // Keyboard navigation

  handleTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.isLoading()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();

        if (!this.isOpen()) {
          this.openDropdown();
        } else {
          this.moveActiveOption(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();

        if (!this.isOpen()) {
          this.openDropdown();
        } else {
          this.moveActiveOption(-1);
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
    }
  }

  handleSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActiveOption(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveActiveOption(-1);
        break;

      case 'Enter':
        event.preventDefault();

        this.selectActiveOption();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  handleOptionKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveActiveOption(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveActiveOption(-1);
        break;

      case 'Home':
        event.preventDefault();
        this.activeIndex.set(this.findInitialActiveIndex());
        break;

      case 'End':
        event.preventDefault();
        this.activeIndex.set(this.findLastActiveIndex());
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectActiveOption();
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  private updateValue(value: unknown): void {
    this.selectedValue.set(value);
    this.onChange(value);
    this.selectionChange.emit(value);
  }

  readonly compareWith = input<(first: unknown, second: unknown) => boolean>((first, second) =>
    Object.is(first, second),
  );

  private isEqual(first: unknown, second: unknown): boolean {
    return this.compareWith()(first, second);
  }

  private findInitialActiveIndex(): number {
    const options = this.filteredOptions();

    const selectedIndex = options.findIndex(
      (option) => !option.disabled && this.isSelected(option.value),
    );

    if (selectedIndex >= 0) {
      return selectedIndex;
    }

    return options.findIndex((option) => !option.disabled);
  }

  private findLastActiveIndex(): number {
    const options = this.filteredOptions();

    for (let index = options.length - 1; index >= 0; index--) {
      if (!options[index].disabled) {
        return index;
      }
    }

    return -1;
  }

  private moveActiveOption(direction: number): void {
    const options = this.filteredOptions();

    if (!options.length) {
      this.activeIndex.set(-1);
      return;
    }

    let index = this.activeIndex();

    for (let attempts = 0; attempts < options.length; attempts++) {
      index = (index + direction + options.length) % options.length;

      if (!options[index].disabled) {
        this.activeIndex.set(index);
        return;
      }
    }
  }

  private selectActiveOption(): void {
    const index = this.activeIndex();
    const option = this.filteredOptions()[index];

    if (option) {
      this.selectOption(option);
    }
  }
}
