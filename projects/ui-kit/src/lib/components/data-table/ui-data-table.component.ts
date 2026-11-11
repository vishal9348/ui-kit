import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  UiTableColumn,
  UiTableColumnChange,
  UiTableConfig,
  UiTablePageChange,
  UiTableRowClick,
  UiTableSelection,
  UiTableSort,
  UiTableSortChange,
  UiTableSortDirection,
} from './ui-data-table.types';

import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { HostListener } from '@angular/core';

@Component({
  selector: 'ui-data-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './ui-data-table.component.html',
  styleUrl: './ui-data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDataTableComponent<T extends Record<string, unknown>> {
  // Inputs
  readonly config = input<UiTableConfig>({});

  readonly columnResizing = input<boolean | undefined>();

  readonly columnChange = output<UiTableColumnChange<T>>();

  readonly columnManagement = input<boolean | undefined>();
  readonly columnReordering = input<boolean | undefined>();

  readonly columnOrder = signal<string[]>([]);

  readonly columnVisibility = signal<Record<string, boolean>>({});

  readonly columns = input<UiTableColumn<T>[]>([]);
  readonly data = input<T[]>([]);

  readonly loading = input<boolean | undefined>();
  readonly searchable = input<boolean | undefined>();
  readonly pagination = input<boolean | undefined>();
  readonly sortable = input<boolean | undefined>();
  readonly selectable = input<boolean | undefined>();
  readonly multiSelect = input<boolean | undefined>();

  readonly pageSize = input<number | undefined>();
  readonly pageSizeOptions = input<number[] | undefined>();

  readonly rowKey = input<string | undefined>();

  readonly emptyMessage = input<string | undefined>();
  readonly searchPlaceholder = input<string | undefined>();
  readonly showRowNumber = input<boolean | undefined>();
  readonly showFooter = input<boolean | undefined>();

  // Outputs
  readonly sortChange = output<UiTableSortChange>();
  readonly pageChange = output<UiTablePageChange>();
  readonly rowClick = output<UiTableRowClick<T>>();
  readonly selectionChange = output<UiTableSelection<T>>();

  // Internal state
  readonly searchTerm = signal('');
  readonly currentPageIndex = signal(0);

  readonly currentPageSize = signal(10);

  readonly currentSort = signal<UiTableSort | null>(null);

  readonly selectedKeys = signal<Set<string | number>>(new Set());

  // Resolved configuration
  readonly resolvedLoading = computed(() => this.loading() ?? this.config().loading ?? false);

  readonly resolvedSearchable = computed(
    () => this.searchable() ?? this.config().searchable ?? true,
  );

  readonly resolvedPagination = computed(
    () => this.pagination() ?? this.config().pagination ?? true,
  );

  readonly resolvedSortable = computed(() => this.sortable() ?? this.config().sortable ?? true);

  readonly resolvedSelectable = computed(
    () => this.selectable() ?? this.config().selectable ?? false,
  );

  readonly resolvedMultiSelect = computed(
    () => this.multiSelect() ?? this.config().multiSelect ?? true,
  );

  readonly resolvedPageSize = computed(() => this.pageSize() ?? this.config().pageSize ?? 10);

  readonly resolvedPageSizeOptions = computed(
    () => this.pageSizeOptions() ?? this.config().pageSizeOptions ?? [5, 10, 25, 50],
  );

  readonly resolvedRowKey = computed(() => this.rowKey() ?? this.config().rowKey ?? 'id');

  readonly resolvedEmptyMessage = computed(
    () => this.emptyMessage() ?? this.config().emptyMessage ?? 'No records found.',
  );

  readonly resolvedSearchPlaceholder = computed(
    () => this.searchPlaceholder() ?? this.config().searchPlaceholder ?? 'Search records...',
  );

  readonly resolvedShowRowNumber = computed(
    () => this.showRowNumber() ?? this.config().showRowNumber ?? false,
  );

  readonly resolvedShowFooter = computed(
    () => this.showFooter() ?? this.config().showFooter ?? true,
  );

  // readonly visibleColumns = computed(() => this.columns().filter((column) => !column.hidden));

  // Search
  readonly filteredData = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const rows = this.data();

    if (!term) {
      return rows;
    }

    return rows.filter((row) =>
      this.visibleColumns().some((column) => {
        const value = this.getCellValue(row, column.key);

        return String(value ?? '')
          .toLowerCase()
          .includes(term);
      }),
    );
  });

  // Sorting
  readonly sortedData = computed(() => {
    const rows = [...this.filteredData()];
    const sort = this.currentSort();

    if (!sort) {
      return rows;
    }

    const column = this.columns().find((item) => String(item.key) === sort.key);

    if (!column) {
      return rows;
    }

    return rows.sort((a, b) => {
      const valueA = this.getCellValue(a, column.key);
      const valueB = this.getCellValue(b, column.key);

      const comparison = this.compareValues(valueA, valueB);

      return sort.direction === 'asc' ? comparison : -comparison;
    });
  });

  // Pagination
  readonly totalItems = computed(() => this.sortedData().length);

  readonly totalPages = computed(() => {
    if (!this.resolvedPagination()) {
      return 1;
    }

    return Math.max(1, Math.ceil(this.totalItems() / this.currentPageSize()));
  });

  readonly paginatedData = computed(() => {
    const rows = this.sortedData();

    if (!this.resolvedPagination()) {
      return rows;
    }

    const start = this.currentPageIndex() * this.currentPageSize();

    return rows.slice(start, start + this.currentPageSize());
  });

  readonly startItem = computed(() =>
    this.totalItems() === 0 ? 0 : this.currentPageIndex() * this.currentPageSize() + 1,
  );

  readonly endItem = computed(() =>
    Math.min((this.currentPageIndex() + 1) * this.currentPageSize(), this.totalItems()),
  );

  readonly allVisibleSelected = computed(() => {
    const rows = this.paginatedData();

    return rows.length > 0 && rows.every((row) => this.isRowSelected(row));
  });

  constructor() {
    effect(() => {
      // Synchronize configured page size.
      const configuredPageSize = this.resolvedPageSize();

      if (
        Number.isFinite(configuredPageSize) &&
        configuredPageSize > 0 &&
        this.currentPageSize() !== configuredPageSize
      ) {
        this.currentPageSize.set(configuredPageSize);
        this.currentPageIndex.set(0);
      }

      // Keep current page within valid bounds when data or search changes.
      const lastPage = this.totalPages() - 1;

      if (this.currentPageIndex() > lastPage) {
        this.currentPageIndex.set(Math.max(0, lastPage));
      }

      // Remove selections for rows that no longer exist.
      const rows = this.data();
      const selected = this.selectedKeys();

      const validKeys = new Set(rows.map((row, index) => this.getRowKey(row, index)));

      const nextSelection = new Set([...selected].filter((key) => validKeys.has(key)));

      if (nextSelection.size !== selected.size) {
        this.selectedKeys.set(nextSelection);
        this.emitSelectionChange();
      }
    });
  }

  // Cell value
  getCellValue(row: T, key: keyof T | string): unknown {
    return row[key as keyof T];
  }

  // Sorting
  toggleSort(column: UiTableColumn<T>): void {
    if (!this.resolvedSortable() || column.sortable === false) {
      return;
    }

    const key = this.getColumnKey(column.key);
    const current = this.currentSort();

    let direction: UiTableSortDirection;

    if (!current || current.key !== key) {
      direction = 'asc';
    } else if (current.direction === 'asc') {
      direction = 'desc';
    } else {
      direction = null;
    }

    const nextSort = direction === null ? null : { key, direction };

    this.currentSort.set(nextSort);

    this.currentPageIndex.set(0);

    this.sortChange.emit({
      active: key,
      direction,
    });
  }

  getSortDirection(key: string): UiTableSortDirection {
    const sort = this.currentSort();

    return sort?.key === key ? sort.direction : null;
  }

  // Search
  handleSearch(value: string): void {
    if (this.searchTerm() === value) {
      return;
    }

    this.searchTerm.set(value);
    this.currentPageIndex.set(0);
  }

  // Pagination
  goToPage(pageIndex: number): void {
    const safePage = Math.max(0, Math.min(pageIndex, this.totalPages() - 1));

    this.currentPageIndex.set(safePage);

    this.emitPageChange();
  }

  previousPage(): void {
    this.goToPage(this.currentPageIndex() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPageIndex() + 1);
  }

  changePageSize(size: number): void {
    if (!Number.isInteger(size) || size < 1) {
      return;
    }

    this.currentPageSize.set(size);
    this.currentPageIndex.set(0);

    this.emitPageChange();
  }

  private emitPageChange(): void {
    this.pageChange.emit({
      pageIndex: this.currentPageIndex(),
      pageSize: this.currentPageSize(),
    });
  }

  // Row selection
  getRowKey(row: T, index: number): string | number {
    const key = row[this.resolvedRowKey()];

    if (typeof key === 'string' || typeof key === 'number') {
      return key;
    }

    return index;
  }

  isRowSelected(row: T): boolean {
    const key = this.getRowKey(row, this.data().indexOf(row));

    return this.selectedKeys().has(key);
  }

  toggleRowSelection(row: T, index: number): void {
    if (!this.resolvedSelectable()) {
      return;
    }

    const key = this.getRowKey(row, index);
    const next = new Set(this.selectedKeys());

    if (next.has(key)) {
      next.delete(key);
    } else {
      if (!this.resolvedMultiSelect()) {
        next.clear();
      }

      next.add(key);
    }

    this.selectedKeys.set(next);
    this.emitSelectionChange();
  }

  toggleSelectAll(): void {
    if (!this.resolvedSelectable() || !this.resolvedMultiSelect()) {
      return;
    }

    const next = new Set(this.selectedKeys());

    if (this.allVisibleSelected()) {
      this.paginatedData().forEach((row) => {
        next.delete(this.getRowKey(row, this.data().indexOf(row)));
      });
    } else {
      this.paginatedData().forEach((row) => {
        next.add(this.getRowKey(row, this.data().indexOf(row)));
      });
    }

    this.selectedKeys.set(next);
    this.emitSelectionChange();
  }

  clearSelection(): void {
    this.selectedKeys.set(new Set());
    this.emitSelectionChange();
  }

  private emitSelectionChange(): void {
    const keys = [...this.selectedKeys()];

    const selectedRows = this.data().filter((row, index) =>
      this.selectedKeys().has(this.getRowKey(row, index)),
    );

    this.selectionChange.emit({
      selectedRows,
      selectedKeys: keys,
    });
  }

  // Row click
  handleRowClick(row: T, index: number): void {
    this.rowClick.emit({
      row,
      index,
    });
  }

  // Comparison
  private compareValues(a: unknown, b: unknown): number {
    if (a === b) {
      return 0;
    }

    if (a === null || a === undefined) {
      return -1;
    }

    if (b === null || b === undefined) {
      return 1;
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return Number(a) - Number(b);
    }

    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }

    return String(a).localeCompare(String(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  }

  getColumnKey(key: keyof T | string): string {
    return String(key);
  }

  readonly resolvedColumnManagement = computed(
    () => this.columnManagement() ?? this.config().columnManagement ?? false,
  );

  readonly resolvedColumnReordering = computed(
    () => this.columnReordering() ?? this.config().columnReordering ?? false,
  );

  readonly orderedColumns = computed(() => {
    const columns = this.columns();
    const order = this.columnOrder();

    if (order.length === 0) {
      return columns;
    }

    const columnMap = new Map(columns.map((column) => [String(column.key), column]));

    const ordered = order
      .map((key) => columnMap.get(key))
      .filter((column): column is UiTableColumn<T> => !!column);

    const remaining = columns.filter((column) => !order.includes(String(column.key)));

    return [...ordered, ...remaining];
  });

  readonly visibleColumns = computed(() =>
    this.orderedColumns().filter((column) => this.isColumnVisible(column)),
  );

  isColumnVisible(column: UiTableColumn<T>): boolean {
    const key = String(column.key);
    const visibility = this.columnVisibility();

    return visibility[key] ?? !column.hidden;
  }

  toggleColumnVisibility(column: UiTableColumn<T>, visible: boolean): void {
    if (column.hideable === false) {
      return;
    }

    const key = String(column.key);

    this.columnVisibility.update((current) => ({
      ...current,
      [key]: visible,
    }));

    this.emitColumnChange();
  }

  dropColumn(event: CdkDragDrop<UiTableColumn<T>[]>): void {
    if (!this.resolvedColumnReordering()) {
      return;
    }

    if (event.previousIndex === event.currentIndex) {
      return;
    }

    const allKeys = this.orderedColumns().map((column) => String(column.key));

    const visibleKeys = this.visibleColumns().map((column) => String(column.key));

    moveItemInArray(visibleKeys, event.previousIndex, event.currentIndex);

    // Reorder only visible columns while preserving hidden-column positions.
    let visibleIndex = 0;

    const nextOrder = allKeys.map((key) =>
      this.isKeyVisible(key) ? visibleKeys[visibleIndex++] : key,
    );

    this.columnOrder.set(nextOrder);

    this.emitColumnChange();
  }

  private isKeyVisible(key: string): boolean {
    const column = this.columns().find((item) => String(item.key) === key);

    return column ? this.isColumnVisible(column) : false;
  }

  private readonly columnWidths = signal<Record<string, string>>({});

  private resizeState: {
    key: string;
    startX: number;
    startWidth: number;
    minWidth: number;
    maxWidth: number;
  } | null = null;

  readonly resolvedColumnResizing = computed(
    () => this.columnResizing() ?? this.config().columnResizing ?? false,
  );

  getColumnWidth(column: UiTableColumn<T>): string | null {
    const key = this.getColumnKey(column.key);

    return this.columnWidths()[key] ?? column.width ?? null;
  }

  startColumnResize(event: PointerEvent, column: UiTableColumn<T>): void {
    if (!this.resolvedColumnResizing()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const header = (event.currentTarget as HTMLElement).closest('th');

    if (!header) {
      return;
    }

    const computedStyle = getComputedStyle(header);
    const startWidth = header.getBoundingClientRect().width;

    this.resizeState = {
      key: this.getColumnKey(column.key),
      startX: event.clientX,
      startWidth,
      minWidth: parseFloat(computedStyle.minWidth) || 80,
      maxWidth: parseFloat(computedStyle.maxWidth) || 2000,
    };
  }

  @HostListener('document:pointermove', ['$event'])
  onColumnResize(event: PointerEvent): void {
    if (!this.resizeState) {
      return;
    }

    const state = this.resizeState;
    const delta = event.clientX - state.startX;

    const width = Math.min(state.maxWidth, Math.max(state.minWidth, state.startWidth + delta));

    this.columnWidths.update((current) => ({
      ...current,
      [state.key]: `${Math.round(width)}px`,
    }));
  }

  @HostListener('document:pointerup')
  stopColumnResize(): void {
    if (!this.resizeState) {
      return;
    }

    this.resizeState = null;
    this.emitColumnChange();
  }

  private emitColumnChange(): void {
    this.columnChange.emit({
      columns: this.orderedColumns().map((column) => ({
        ...column,
        width: this.getColumnWidth(column) ?? column.width,
      })),
      visibleColumns: this.visibleColumns().map((column) => this.getColumnKey(column.key)),
      columnOrder: this.orderedColumns().map((column) => this.getColumnKey(column.key)),
    });
  }
}
