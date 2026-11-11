export type UiTableSortDirection = 'asc' | 'desc' | null;

export type UiTableColumnType = 'text' | 'number' | 'date' | 'boolean' | 'currency';


export interface UiTableSort {
  key: string;
  direction: Exclude<UiTableSortDirection, null>;
}

export interface UiTablePagination {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
}

export interface UiTableSelection<T> {
  selectedRows: T[];
  selectedKeys: Array<string | number>;
}

export interface UiTableSortChange {
  active: string;
  direction: UiTableSortDirection;
}

export interface UiTablePageChange {
  pageIndex: number;
  pageSize: number;
}

export interface UiTableRowClick<T> {
  row: T;
  index: number;
}

export interface UiTableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  header: string;

  type?: UiTableColumnType;
  sortable?: boolean;
  filterable?: boolean;

  width?: string;
  minWidth?: string;
  maxWidth?: string;

  align?: 'left' | 'center' | 'right';
  currency?: string;
  dateFormat?: string;

  /** Initial visibility */
  hidden?: boolean;

  /** Allow users to hide/show this column */
  hideable?: boolean;

  /** Allow drag-and-drop rearrangement */
  reorderable?: boolean;

  /** Keep column fixed while horizontally scrolling */
  sticky?: 'left' | 'right';
}

export type UiTableDensity = 'compact' | 'comfortable' | 'spacious';

export interface UiTableConfig {
  searchable?: boolean;
  pagination?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;

  pageSize?: number;
  pageSizeOptions?: number[];
  rowKey?: string;

  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;

  showRowNumber?: boolean;
  showFooter?: boolean;

  /** Enable column visibility selector */
  columnManagement?: boolean;

  /** Enable drag-and-drop column rearrangement */
  columnReordering?: boolean;

  /** Enable column resizing */
  columnResizing?: boolean;

  /** Enable sticky table header */
  stickyHeader?: boolean;

  /** Initial table density */
  density?: UiTableDensity;

  /** Optional key for persisting user preferences */
  storageKey?: string;
}

export interface UiTableColumnChange<T = Record<string, unknown>> {
  columns: UiTableColumn<T>[];
  visibleColumns: string[];
  columnOrder: string[];
}
