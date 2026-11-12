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
  serverSide?: boolean;

  pageSize?: number;
  pageSizeOptions?: number[];
  rowKey?: string;

  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;

  showRowNumber?: boolean;
  showFooter?: boolean;
  columnManagement?: boolean;
  columnReordering?: boolean;
  columnResizing?: boolean;
  stickyHeader?: boolean;
  density?: UiTableDensity;
  storageKey?: string;
  columnFiltering?: boolean;
  csvExport?: boolean;
  csvFileName?: string;
}

export interface UiTableColumnChange<T = Record<string, unknown>> {
  columns: UiTableColumn<T>[];
  visibleColumns: string[];
  columnOrder: string[];
}



export type UiTableFilterOperator =
  'contains' | 'equals' | 'startsWith' | 'gt' | 'lt' | 'before' | 'after';

export interface UiTableColumnFilter {
  value: string;
  operator: UiTableFilterOperator;
}

export type UiTableFilters = Record<string, UiTableColumnFilter>;

export interface UiTableFilterChange {
  filters: UiTableFilters;
  activeFilterCount: number;
}


export interface UiTableQueryChange {
  pageIndex: number;
  pageSize: number;
  search: string;
  sort: UiTableSort | null;
  filters: UiTableFilters;
}
