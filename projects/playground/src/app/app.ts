import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  UiButtonComponent,
  UiSize,
  UiVariant,
  UiDropdownComponent,
  UiDropdownOption,
  UiCheckboxComponent,
  UiRadioGroupComponent,
} from 'ui-kit';
import { FormsModule } from '@angular/forms';

import type { UiRadioOption } from 'ui-kit';

type PlaygroundTheme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UiButtonComponent,
    UiDropdownComponent,
    FormsModule,
    UiCheckboxComponent,
    UiRadioGroupComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly libraryName = 'Angular UI Kit';
  readonly version = '0.0.1';

  readonly theme = signal<PlaygroundTheme>('light');

  readonly activeComponent = signal('button');

  readonly variant = signal<UiVariant>('primary');

  readonly size = signal<UiSize>('md');

  readonly loading = signal(false);

  readonly disabled = signal(false);

  readonly fullWidth = signal(false);

  readonly clickCount = signal(0);

  readonly copyLabel = signal('Copy code');

  readonly buttonConfig = computed(() => ({
    variant: this.variant(),
    size: this.size(),
    loading: this.loading(),
    disabled: this.disabled(),
    fullWidth: this.fullWidth(),
  }));

  readonly generatedCode = computed(() => {
    const config = this.buttonConfig();

    const properties = [
      `variant: '${config.variant}'`,
      `size: '${config.size}'`,
      `loading: ${config.loading}`,
      `disabled: ${config.disabled}`,
      `fullWidth: ${config.fullWidth}`,
    ];

    return `<ui-button
  label="Save Employee"
  [config]="{
    ${properties.join(',\n    ')}
  }"
  (clicked)="saveEmployee()"
/>`;
  });

  setVariant(value: string): void {
    this.variant.set(value as UiVariant);
  }

  setSize(value: string): void {
    this.size.set(value as UiSize);
  }

  setTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setActiveComponent(component: string): void {
    this.activeComponent.set(component);
  }

  handleButtonClick(): void {
    this.clickCount.update((count) => count + 1);
  }

  resetConfiguration(): void {
    this.variant.set('primary');
    this.size.set('md');
    this.loading.set(false);
    this.disabled.set(false);
    this.fullWidth.set(false);
    this.clickCount.set(0);
  }

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.generatedCode());

      this.copyLabel.set('Copied!');
    } catch {
      this.copyLabel.set('Copy unavailable');
    }
  }

  readonly departments: UiDropdownOption<number>[] = [
    {
      label: 'Engineering',
      value: 101,
      description: 'Software and development',
    },
    {
      label: 'Finance',
      value: 102,
    },
    {
      label: 'Human Resources',
      value: 103,
    },
    {
      label: 'Marketing',
      value: 104,
    },
    {
      label: 'Operations',
      value: 105,
    },
    {
      label: 'Archived',
      value: 106,
      disabled: true,
    },
  ];

  // dropdown

  // Dropdown configuration
  dropdownMultiple = signal(false);
  dropdownSearchable = signal(true);
  dropdownClearable = signal(true);
  dropdownDisabled = signal(false);
  dropdownLoading = signal(false);

  // Dropdown selected value supports both single and multiple selection
  selectedDropdownValue = signal<number | number[] | null>(null);

  readonly selectedDepartment = signal<number | null>(null);

  readonly selectedDepartments = signal<number[]>([]);

  readonly dropdownConfig = {
    searchable: true,
    clearable: true,
    placeholder: 'Select department',
    searchPlaceholder: 'Search departments...',
  };

  readonly dropdownUsageCode = computed(() => {
    const multiple = this.dropdownMultiple();
    const searchable = this.dropdownSearchable();
    const clearable = this.dropdownClearable();
    const disabled = this.dropdownDisabled();
    const loading = this.dropdownLoading();

    const selectionType = multiple ? 'number[]' : 'number | null';
    const selectedValue = multiple ? 'selectedDepartments' : 'selectedDepartment';

    return `<ui-dropdown
  [options]="departments"
  [multiple]="${multiple}"
  [searchable]="${searchable}"
  [clearable]="${clearable}"
  [disabled]="${disabled}"
  [loading]="${loading}"
  [ngModel]="${selectedValue}()"
  (ngModelChange)="${selectedValue}.set($event)"
/>

<!-- Component TypeScript -->
selectedValue = signal<${selectionType}>(${multiple ? '[]' : 'null'});`;
  });

  // checkbox

  checkboxChecked = signal(false);
  checkboxIndeterminate = signal(false);
  checkboxDisabled = signal(false);
  checkboxRequired = signal(false);
  checkboxSize = signal<'sm' | 'md' | 'lg'>('md');

  readonly checkboxUsageCode = computed(() => {
    return `<ui-checkbox
  label="Accept Terms and Conditions"
  [checked]="checkboxChecked()"
  [indeterminate]="${this.checkboxIndeterminate()}"
  [disabled]="${this.checkboxDisabled()}"
  [required]="${this.checkboxRequired()}"
  size="${this.checkboxSize()}"
  (checkedChange)="checkboxChecked.set($event)"
/>`;
  });

  // radio group

  radioOptions: UiRadioOption<string>[] = [
    {
      label: 'Engineering',
      value: 'engineering',
      description: 'Software development and technology',
    },
    {
      label: 'Human Resources',
      value: 'hr',
      description: 'People and recruitment',
    },
    {
      label: 'Finance',
      value: 'finance',
      description: 'Accounts and financial operations',
    },
  ];

  radioOrientation = signal<'horizontal' | 'vertical'>('vertical');

  radioSize = signal<'sm' | 'md' | 'lg'>('md');

  radioDisabled = signal(false);

  radioRequired = signal(false);

  selectedRadioValue = signal<string | null>('engineering');

  radioUsageCode = computed(() => {
    const orientation = this.radioOrientation();
    const size = this.radioSize();
    const disabled = this.radioDisabled();
    const required = this.radioRequired();

    return `<ui-radio-group
  label="Select Department"
  [options]="radioOptions"
  orientation="${orientation}"
  size="${size}"
  [disabled]="${disabled}"
  [required]="${required}"
  [ngModel]="selectedRadioValue()"
  (ngModelChange)="selectedRadioValue.set($event)"
/>

// Component TypeScript
selectedRadioValue = signal<string | null>('engineering');`;
  });
}
