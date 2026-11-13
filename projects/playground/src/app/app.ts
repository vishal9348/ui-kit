import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

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
  UiDataTableComponent,
  UiDatePickerComponent,
  UiTabsComponent,
  UiTabContentDirective,
  UiTooltipDirective,
} from 'ui-kit';

import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import type {
  UiRadioOption,
  UiBreadcrumbItem,
  UiToastPosition,
  UiTableColumn,
  UiTableConfig,
  UiTableQueryChange,
  UiTableSelection,
  UiTableRowClick,
  UiTableColumnChange,
  UiTableFilterChange,
  UiTab,
  UiTabsVariant,
  UiTabsOrientation,
  UiTabsSize,
} from 'ui-kit';

type PlaygroundTheme = 'light' | 'dark';

interface Employee extends Record<string, unknown> {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  joinedAt: string;
  active: boolean;
}

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
    UiDataTableComponent,
    UiDatePickerComponent,
    DatePipe,
    UiTabsComponent,
    UiTabContentDirective,
    UiTooltipDirective,
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
    | 'data-table'
    | 'date-picker'
    | 'tabs'
    | 'tooltip'
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
      | 'switch'
      | 'data-table'
      | 'date-picker'
      | 'tabs'
      | 'tooltip',
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

  // ======================================
  // DATA TABLE
  // ======================================

  readonly employees: Employee[] = [
    {
      id: 101,
      name: 'Aarav Sharma',
      department: 'Engineering',
      role: 'Senior Developer',
      salary: 125000,
      joinedAt: '2022-03-14',
      active: true,
    },
    {
      id: 102,
      name: 'Priya Verma',
      department: 'HR',
      role: 'HR Manager',
      salary: 95000,
      joinedAt: '2021-07-19',
      active: true,
    },
    {
      id: 103,
      name: 'Rahul Singh',
      department: 'Finance',
      role: 'Financial Analyst',
      salary: 85000,
      joinedAt: '2023-01-10',
      active: true,
    },
    {
      id: 104,
      name: 'Sneha Patel',
      department: 'Engineering',
      role: 'Backend Developer',
      salary: 110000,
      joinedAt: '2022-11-21',
      active: true,
    },
    {
      id: 105,
      name: 'Vikram Rao',
      department: 'Marketing',
      role: 'Marketing Lead',
      salary: 105000,
      joinedAt: '2020-06-15',
      active: false,
    },
    {
      id: 106,
      name: 'Ananya Das',
      department: 'Engineering',
      role: 'Frontend Developer',
      salary: 98000,
      joinedAt: '2023-04-03',
      active: true,
    },
    {
      id: 107,
      name: 'Karan Mehta',
      department: 'Finance',
      role: 'Accountant',
      salary: 72000,
      joinedAt: '2021-09-12',
      active: true,
    },
    {
      id: 108,
      name: 'Neha Gupta',
      department: 'HR',
      role: 'Recruiter',
      salary: 68000,
      joinedAt: '2024-02-01',
      active: true,
    },
    {
      id: 109,
      name: 'Arjun Nair',
      department: 'Engineering',
      role: 'Tech Lead',
      salary: 150000,
      joinedAt: '2019-12-09',
      active: true,
    },
    {
      id: 110,
      name: 'Ishita Roy',
      department: 'Marketing',
      role: 'Content Strategist',
      salary: 78000,
      joinedAt: '2022-08-17',
      active: false,
    },
    {
      id: 111,
      name: 'Rohan Kumar',
      department: 'Engineering',
      role: 'DevOps Engineer',
      salary: 118000,
      joinedAt: '2021-05-24',
      active: true,
    },
    {
      id: 112,
      name: 'Meera Iyer',
      department: 'Finance',
      role: 'Finance Manager',
      salary: 132000,
      joinedAt: '2018-10-08',
      active: true,
    },
    {
      id: 113,
      name: 'Aditya Joshi',
      department: 'Engineering',
      role: 'QA Engineer',
      salary: 88000,
      joinedAt: '2023-06-12',
      active: false,
    },
    {
      id: 114,
      name: 'Pooja Mishra',
      department: 'HR',
      role: 'HR Executive',
      salary: 62000,
      joinedAt: '2024-01-15',
      active: true,
    },
    {
      id: 115,
      name: 'Siddharth Bose',
      department: 'Marketing',
      role: 'SEO Specialist',
      salary: 76000,
      joinedAt: '2022-12-05',
      active: true,
    },
  ];

  readonly tableColumns: UiTableColumn<Employee>[] = [
    {
      key: 'id',
      header: 'Employee ID',
      type: 'number',
      sortable: true,
      filterable: true,
      width: '120px',
    },
    {
      key: 'name',
      header: 'Employee Name',
      type: 'text',
      sortable: true,
      filterable: true,
      minWidth: '180px',
    },
    { key: 'department', header: 'Department', type: 'text', sortable: true, filterable: true },
    {
      key: 'role',
      header: 'Designation',
      type: 'text',
      sortable: true,
      filterable: true,
      minWidth: '170px',
    },
    {
      key: 'salary',
      header: 'Salary',
      type: 'currency',
      sortable: true,
      filterable: true,
      currency: 'INR',
      align: 'right',
    },
    { key: 'joinedAt', header: 'Joining Date', type: 'date', sortable: true, filterable: true },
    {
      key: 'active',
      header: 'Active',
      type: 'boolean',
      sortable: true,
      filterable: true,
      align: 'center',
    },
  ];

  tableSearchable = signal(true);
  tablePagination = signal(true);
  tableSortable = signal(true);
  tableSelectable = signal(true);
  tableMultiSelect = signal(true);
  tableShowRowNumber = signal(true);
  tableShowFooter = signal(true);

  tableColumnManagement = signal(true);
  tableColumnReordering = signal(true);
  tableColumnResizing = signal(true);
  tableColumnFiltering = signal(true);

  tableStickyHeader = signal(true);
  tableDensity = signal<'compact' | 'comfortable' | 'spacious'>('comfortable');

  tablePageSize = signal(5);
  tablePageSizeOptions = [5, 10, 15];

  tableLoading = signal(false);
  tableEmptyState = signal(false);

  tableCsvExport = signal(true);
  tableCsvFileName = signal('employees.csv');

  tableServerSide = signal(false);

  tableData = signal<Employee[]>([...this.employees]);
  tableTotalItems = signal(this.employees.length);

  tableSelectedRows = signal<Employee[]>([]);
  tableLastClickedRow = signal<Employee | null>(null);
  tableLastSort = signal('No sorting applied');
  tableLastPage = signal('Page 1');
  tableLastFilterCount = signal(0);
  tableLastColumnChange = signal('No column changes yet');

  readonly tableConfig = computed<UiTableConfig>(() => ({
    rowKey: 'id',
    searchable: this.tableSearchable(),
    pagination: this.tablePagination(),
    sortable: this.tableSortable(),
    selectable: this.tableSelectable(),
    multiSelect: this.tableMultiSelect(),
    pageSize: this.tablePageSize(),
    pageSizeOptions: this.tablePageSizeOptions,
    showRowNumber: this.tableShowRowNumber(),
    showFooter: this.tableShowFooter(),
    columnManagement: this.tableColumnManagement(),
    columnReordering: this.tableColumnReordering(),
    columnResizing: this.tableColumnResizing(),
    stickyHeader: this.tableStickyHeader(),
    density: this.tableDensity(),
    columnFiltering: this.tableColumnFiltering(),
    serverSide: this.tableServerSide(),
    csvExport: this.tableCsvExport(),
    csvFileName: this.tableCsvFileName(),
    loading: this.tableLoading(),
    emptyMessage: 'No employees found.',
    searchPlaceholder: 'Search employees...',
  }));

  // Server-side simulation: filters, sorts and paginates the source dataset.
  loadEmployees(query: UiTableQueryChange): void {
    let result = [...this.employees];

    if (query.search.trim()) {
      const search = query.search.trim().toLowerCase();

      result = result.filter((employee) =>
        Object.values(employee).some((value) => String(value).toLowerCase().includes(search)),
      );
    }

    for (const [key, filter] of Object.entries(query.filters)) {
      const filterValue = filter.value.trim().toLowerCase();

      if (!filterValue) continue;

      result = result.filter((employee) => {
        const value = employee[key as keyof Employee];

        if (value === null || value === undefined) return false;

        if (typeof value === 'number') {
          const target = Number(filter.value);

          if (!Number.isFinite(target)) return false;

          switch (filter.operator) {
            case 'equals':
              return value === target;
            case 'gt':
              return value > target;
            case 'lt':
              return value < target;
            default:
              return true;
          }
        }

        if (key === 'joinedAt') {
          const date = new Date(String(value)).getTime();
          const target = new Date(filter.value).getTime();

          if (Number.isNaN(date) || Number.isNaN(target)) return false;

          switch (filter.operator) {
            case 'equals':
              return new Date(date).toDateString() === new Date(target).toDateString();
            case 'before':
              return date < target;
            case 'after':
              return date > target;
            default:
              return true;
          }
        }

        const normalized = String(value).toLowerCase();

        switch (filter.operator) {
          case 'equals':
            return normalized === filterValue;
          case 'startsWith':
            return normalized.startsWith(filterValue);
          case 'contains':
          default:
            return normalized.includes(filterValue);
        }
      });
    }

    if (query.sort) {
      const { key, direction } = query.sort;

      result.sort((a, b) => {
        const first = a[key as keyof Employee];
        const second = b[key as keyof Employee];

        const comparison =
          typeof first === 'number' && typeof second === 'number'
            ? first - second
            : String(first ?? '').localeCompare(String(second ?? ''));

        return direction === 'asc' ? comparison : -comparison;
      });
    }

    this.tableTotalItems.set(result.length);

    const start = query.pageIndex * query.pageSize;
    this.tableData.set(result.slice(start, start + query.pageSize));
  }

  onTableQueryChange(query: UiTableQueryChange): void {
    this.loadEmployees(query);
  }

  onTableSelectionChange(event: UiTableSelection<Employee>): void {
    this.tableSelectedRows.set(event.selectedRows);
  }

  onTableRowClick(event: UiTableRowClick<Employee>): void {
    this.tableLastClickedRow.set(event.row);
  }

  onTableSortChange(event: { active: string; direction: 'asc' | 'desc' | null }): void {
    this.tableLastSort.set(
      event.direction ? `${event.active} (${event.direction})` : 'No sorting applied',
    );
  }

  onTablePageChange(event: { pageIndex: number; pageSize: number }): void {
    this.tableLastPage.set(`Page ${event.pageIndex + 1} · ${event.pageSize} rows`);
  }

  onTableFilterChange(event: UiTableFilterChange): void {
    this.tableLastFilterCount.set(event.activeFilterCount);
  }

  onTableColumnChange(event: UiTableColumnChange<Employee>): void {
    this.tableLastColumnChange.set(
      `Visible: ${event.visibleColumns.length} · Order: ${event.columnOrder.join(', ')}`,
    );
  }

  setTableServerSide(enabled: boolean): void {
    this.tableServerSide.set(enabled);
    this.tableSelectedRows.set([]);

    if (enabled) {
      this.loadEmployees({
        pageIndex: 0,
        pageSize: this.tablePageSize(),
        search: '',
        sort: null,
        filters: {},
      });
    } else {
      this.tableData.set([...this.employees]);
      this.tableTotalItems.set(this.employees.length);
    }
  }

  setTableEmptyState(enabled: boolean): void {
    this.tableEmptyState.set(enabled);
    this.tableData.set(enabled ? [] : [...this.employees]);
    this.tableTotalItems.set(enabled ? 0 : this.employees.length);
  }

  resetTableConfiguration(): void {
    this.tableSearchable.set(true);
    this.tablePagination.set(true);
    this.tableSortable.set(true);
    this.tableSelectable.set(true);
    this.tableMultiSelect.set(true);
    this.tableShowRowNumber.set(true);
    this.tableShowFooter.set(true);

    this.tableColumnManagement.set(true);
    this.tableColumnReordering.set(true);
    this.tableColumnResizing.set(true);
    this.tableColumnFiltering.set(true);

    this.tableStickyHeader.set(true);
    this.tableDensity.set('comfortable');

    this.tablePageSize.set(5);
    this.tableLoading.set(false);
    this.tableEmptyState.set(false);

    this.tableCsvExport.set(true);
    this.tableCsvFileName.set('employees.csv');

    this.setTableServerSide(false);

    this.tableSelectedRows.set([]);
    this.tableLastClickedRow.set(null);
    this.tableLastSort.set('No sorting applied');
    this.tableLastPage.set('Page 1');
    this.tableLastFilterCount.set(0);
    this.tableLastColumnChange.set('No column changes yet');
  }

  readonly tableUsageCode = computed(
    () => `
<ui-data-table
  [columns]="columns"
  [data]="employees"
  [config]="{
    rowKey: 'id',
    searchable: ${this.tableSearchable()},
    pagination: ${this.tablePagination()},
    sortable: ${this.tableSortable()},
    selectable: ${this.tableSelectable()},
    multiSelect: ${this.tableMultiSelect()},
    pageSize: ${this.tablePageSize()},
    showRowNumber: ${this.tableShowRowNumber()},
    showFooter: ${this.tableShowFooter()},
    columnManagement: ${this.tableColumnManagement()},
    columnReordering: ${this.tableColumnReordering()},
    columnResizing: ${this.tableColumnResizing()},
    stickyHeader: ${this.tableStickyHeader()},
    density: '${this.tableDensity()}',
    columnFiltering: ${this.tableColumnFiltering()},
    serverSide: ${this.tableServerSide()},
    csvExport: ${this.tableCsvExport()},
    csvFileName: '${this.tableCsvFileName()}'
  }"
  (selectionChange)="handleSelection($event)"
  (rowClick)="handleRowClick($event)"
  (sortChange)="handleSort($event)"
  (pageChange)="handlePage($event)"
  (filterChange)="handleFilter($event)"
  (columnChange)="handleColumns($event)"
  (queryChange)="loadEmployees($event)"
/>
`,
  );

  // date picker

  readonly dateOfBirth = signal<Date | null>(null);

  readonly travelDates = signal<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  readonly minDate = new Date(1950, 0, 1);
  readonly maxDate = new Date();

  readonly selectedDate = signal<Date | null>(null);

  readonly datePickerMinDate = new Date(1950, 0, 1);

  readonly datePickerMaxDate = new Date(2035, 11, 31);

  readonly datePickerCopyLabel = signal('Copy code');

  readonly datePickerUsageCode = computed(
    () => `
<ui-date-picker
  label="Date of Birth"
  placeholder="Select date"
  [minDate]="minDate"
  [maxDate]="maxDate"
  dateFormat="dd/MM/yyyy"
  [clearable]="true"
  [(ngModel)]="selectedDate"
/>

// Component TypeScript

selectedDate = signal<Date | null>(null);

minDate = new Date(1950, 0, 1);
maxDate = new Date(2035, 11, 31);
`,
  );

  async copyDatePickerCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.datePickerUsageCode());
      this.datePickerCopyLabel.set('Copied!');
    } catch {
      this.datePickerCopyLabel.set('Copy unavailable');
    }
  }

  // Date Picker examples

  readonly datePickerDisabled = signal(false);
  readonly datePickerReadonly = signal(false);

  readonly datePickerSize = signal<'sm' | 'md' | 'lg'>('md');

  readonly datePickerDisabledDates: Date[] = [
    new Date(2026, 10, 15),
    new Date(2026, 10, 20),
    new Date(2026, 10, 25),
  ];

  readonly datePickerRangeMin = new Date(2026, 0, 1);
  readonly datePickerRangeMax = new Date(2027, 11, 31);

  // ======================================
  // TABS
  // ======================================

  readonly tabsVariant = signal<UiTabsVariant>('underline');

  readonly tabsOrientation = signal<UiTabsOrientation>('horizontal');

  readonly tabsSize = signal<UiTabsSize>('md');

  readonly selectedTab = signal<string | null>('overview');

  readonly tabs: UiTab[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '⌂',
      description: 'General information',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      description: 'Personal details',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙',
      description: 'Application preferences',
    },
    {
      id: 'billing',
      label: 'Billing',
      disabled: true,
    },
  ];

  readonly tabsUsageCode = computed(() => {
    return `<ui-tabs
  [tabs]="tabs"
  variant="${this.tabsVariant()}"
  orientation="${this.tabsOrientation()}"
  size="${this.tabsSize()}"
  [(activeTab)]="selectedTab"
>
  <ng-template uiTabContent="overview">
    <h3>Overview</h3>
    <p>Overview content goes here.</p>
  </ng-template>

  <ng-template uiTabContent="profile">
    <h3>Profile</h3>
    <p>Profile content goes here.</p>
  </ng-template>

  <ng-template uiTabContent="settings">
    <h3>Settings</h3>
    <p>Settings content goes here.</p>
  </ng-template>
</ui-tabs>

// Component TypeScript
selectedTab = signal<string | null>('overview');`;
  });

  // ======================================
  // TOOLTIP
  // ======================================

  tooltipPosition = signal<'top' | 'bottom' | 'left' | 'right'>('top');

  tooltipTrigger = signal<'hover' | 'click'>('hover');

  tooltipDelay = signal(300);

  tooltipMaxWidth = signal(240);

  tooltipDisabled = signal(false);

  tooltipText = signal('This is a helpful tooltip message.');

  readonly tooltipUsageCode = computed(() => {
    const position = this.tooltipPosition();
    const trigger = this.tooltipTrigger();
    const delay = this.tooltipDelay();
    const maxWidth = this.tooltipMaxWidth();
    const disabled = this.tooltipDisabled();

    return `<button
  uiTooltip="${this.tooltipText()}"
  uiTooltipPosition="${position}"
  uiTooltipTrigger="${trigger}"
  [uiTooltipDelay]="${delay}"
  [uiTooltipMaxWidth]="${maxWidth}"
  [uiTooltipDisabled]="${disabled}"
>
  Hover or click me
</button>`;
  });

  resetTooltipConfiguration(): void {
    this.tooltipPosition.set('top');
    this.tooltipTrigger.set('hover');
    this.tooltipDelay.set(300);
    this.tooltipMaxWidth.set(240);
    this.tooltipDisabled.set(false);
    this.tooltipText.set('This is a helpful tooltip message.');
  }

  // copyLabel = signal('Copy code');

  async copyTooltipCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.tooltipUsageCode());
      this.copyLabel.set('Copied!');
    } catch (error) {
      console.error('Failed to copy tooltip code:', error);
      this.copyLabel.set('Copy failed');
    }
  }
}
