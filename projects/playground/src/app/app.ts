import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import {
  UiButtonComponent,
  UiSize,
  UiVariant,
  UiDropdownComponent,
  UiDropdownOption,
  UiCheckboxComponent,
  UiRadioGroupComponent,
  UiDialogComponent,
  UiDialogService,
  UiLoaderComponent,
  UiProgressBarComponent,
  UiBreadcrumbComponent,
  UiToastContainerComponent,
  UiToastService,
  UiInputComponent,
  UiTextareaComponent,
  UiSwitchComponent,
} from 'ui-kit';

import { FormsModule } from '@angular/forms';

import type { UiRadioOption, UiBreadcrumbItem, UiToastPosition } from 'ui-kit';

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
    UiDialogComponent,
    UiLoaderComponent,
    UiProgressBarComponent,
    UiBreadcrumbComponent,
    UiToastContainerComponent,
    UiInputComponent,
    UiTextareaComponent,
    UiSwitchComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly libraryName = 'Angular UI Kit';
  readonly version = '0.0.1';

  readonly theme = signal<PlaygroundTheme>('light');

  // readonly activeComponent = signal('button');
  activeComponent = signal<
    | 'button'
    | 'dropdown'
    | 'checkbox'
    | 'radio'
    | 'dialog'
    | 'loader'
    | 'progress'
    | 'breadcrumb'
    | 'toast'
    | 'input'
    | 'textarea'
    | 'switch'
  >('button');

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

  setActiveComponent(
    component:
      | 'button'
      | 'dropdown'
      | 'checkbox'
      | 'radio'
      | 'dialog'
      | 'loader'
      | 'progress'
      | 'breadcrumb'
      | 'toast'
      | 'input'
      | 'textarea'
      | 'switch',
  ): void {
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

  // dialog

  readonly dialogService = inject(UiDialogService);

  dialogOpen = signal(false);

  dialogVariant = signal<'info' | 'success' | 'warning' | 'danger'>('info');

  dialogMode = signal<'alert' | 'confirm'>('confirm');

  dialogSize = signal<'sm' | 'md' | 'lg'>('md');

  dialogLoading = signal(false);

  dialogUsageCode = computed(() => {
    const variant = this.dialogVariant();
    const mode = this.dialogMode();
    const size = this.dialogSize();

    return `<ui-dialog
  [open]="showDialog()"
  title="Confirm Action"
  message="Are you sure you want to continue?"
  variant="${variant}"
  mode="${mode}"
  size="${size}"
  confirmText="Continue"
  cancelText="Cancel"
  (confirmed)="handleConfirm()"
  (closed)="showDialog.set(false)"
/>

// Component TypeScript
showDialog = signal(false);`;
  });

  openServiceDialog(): void {
    this.dialogService
      .confirm({
        title: 'Service Dialog',
        message: 'This dialog was opened using UiDialogService.',
        variant: 'success',
        confirmText: 'Continue',
        cancelText: 'Cancel',
      })
      .closed.subscribe((confirmed) => {
        console.log('Confirmed:', confirmed);
      });
  }

  // Breadcrumb

  // ======================================
  // LOADER
  // ======================================

  loaderSize = signal<'sm' | 'md' | 'lg'>('md');

  loaderVariant = signal<'primary' | 'secondary' | 'light' | 'dark'>('primary');

  loaderText = signal('Loading data...');

  loaderOverlay = signal(false);

  loaderFullscreen = signal(false);

  loaderVisible = signal(true);

  loaderUsageCode = computed(() => {
    return `<ui-loader
  size="${this.loaderSize()}"
  variant="${this.loaderVariant()}"
  text="${this.loaderText()}"
  [overlay]="${this.loaderOverlay()}"
  [fullscreen]="${this.loaderFullscreen()}"
  [visible]="${this.loaderVisible()}"
/>`;
  });

  // ======================================
  // PROGRESS BAR
  // ======================================

  progressValue = signal(65);

  progressSize = signal<'sm' | 'md' | 'lg'>('md');

  progressVariant = signal<'primary' | 'success' | 'warning' | 'danger' | 'info'>('primary');

  progressLabel = signal('Uploading document');

  progressIndeterminate = signal(false);

  progressStriped = signal(false);

  progressAnimated = signal(false);

  progressShowValue = signal(true);

  progressUsageCode = computed(() => {
    return `<ui-progress-bar
  [value]="${this.progressValue()}"
  label="${this.progressLabel()}"
  size="${this.progressSize()}"
  variant="${this.progressVariant()}"
  [indeterminate]="${this.progressIndeterminate()}"
  [striped]="${this.progressStriped()}"
  [animated]="${this.progressAnimated()}"
  [showValue]="${this.progressShowValue()}"
/>`;
  });

  // ======================================
  // BREADCRUMB
  // ======================================

  breadcrumbSeparator = signal('/');

  breadcrumbItems: UiBreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Employees', href: '/employees' },
    { label: 'Employee Details' },
  ];

  breadcrumbUsageCode = computed(() => {
    return `<ui-breadcrumb
  [items]="breadcrumbItems"
  separator="${this.breadcrumbSeparator()}"
/>

// Component TypeScript
breadcrumbItems: UiBreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Employees', href: '/employees' },
  { label: 'Employee Details' }
];`;
  });

  private readonly toastService = inject(UiToastService);

  toastPosition = signal<UiToastPosition>('top-right');

  showSuccessToast(): void {
    this.toastService.success('Employee saved successfully.', 'Success');
  }

  showErrorToast(): void {
    this.toastService.error('Unable to save employee.', 'Error');
  }

  showWarningToast(): void {
    this.toastService.warning('Please check the entered information.', 'Warning');
  }

  showInfoToast(): void {
    this.toastService.info('A new update is available.', 'Information');
  }

  toastUsageCode = computed(() => {
    return `private readonly toast = inject(UiToastService);

this.toast.success(
  'Employee saved successfully.',
  'Success'
);

this.toast.setPosition('${this.toastPosition()}');`;
  });

  inputSize = signal<'sm' | 'md' | 'lg'>('md');

  inputType = signal<'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'>('text');

  inputDisabled = signal(false);

  inputRequired = signal(false);

  inputPrefix = signal('');

  inputSuffix = signal('');

  inputError = signal('');

  inputValue = signal('');
  inputEmail = signal('');
  inputUsername = signal('');
  inputCustomPattern = signal('');
  inputMinLength = signal<number | undefined>(2);
  inputMaxLength = signal<number | undefined>(100);

  inputUsageCode = computed(() => {
    return `<ui-input
  label="User Input"
  type="${this.inputType()}"
  size="${this.inputSize()}"
  placeholder="Enter value"
  prefix="${this.inputPrefix()}"
  suffix="${this.inputSuffix()}"
  [disabled]="${this.inputDisabled()}"
  [required]="${this.inputRequired()}"
  [minLength]="${this.inputMinLength() ?? 'undefined'}"
  [maxLength]="${this.inputMaxLength() ?? 'undefined'}"
  [error]="${JSON.stringify(this.inputError())}"
  [ngModel]="inputValue()"
(ngModelChange)="inputValue.set($event)"
/>

// Component TypeScript
inputValue = '';
`;
  });

  textareaSize = signal<'sm' | 'md' | 'lg'>('md');

  textareaResize = signal<'none' | 'vertical' | 'horizontal' | 'both'>('vertical');

  textareaDisabled = signal(false);

  textareaRequired = signal(false);

  textareaCounter = signal(true);

  textareaValue = signal('');

  textareaMaxLength = signal(250);

  textareaUsageCode = computed(() => {
    return `<ui-textarea
  label="Description"
  placeholder="Enter description"
  size="${this.textareaSize()}"
  resize="${this.textareaResize()}"
  [maxLength]="${this.textareaMaxLength()}"
  [showCounter]="${this.textareaCounter()}"
  [disabled]="${this.textareaDisabled()}"
  [required]="${this.textareaRequired()}"
  [(ngModel)]="description"
/>

// Component TypeScript
description = '';`;
  });

  switchSize = signal<'sm' | 'md' | 'lg'>('md');

  switchDisabled = signal(false);

  switchChecked = signal(true);

  switchUsageCode = computed(() => {
    return `<ui-switch
  label="Email Notifications"
  description="Receive notifications through email."
  size="${this.switchSize()}"
  [disabled]="${this.switchDisabled()}"
  [(ngModel)]="notificationsEnabled"
/>

// Component TypeScript
notificationsEnabled = true;`;
  });
}
