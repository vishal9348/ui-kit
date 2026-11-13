export type UiDatePickerSelectionMode = 'single' | 'range';
export type UiDatePickerSize = 'sm' | 'md' | 'lg';

export interface UiDateRange {
  start: Date | null;
  end: Date | null;
}

export type UiDatePickerValue = Date | UiDateRange | null;

export interface UiDatePickerConfig {
  selectionMode?: UiDatePickerSelectionMode;
  size?: UiDatePickerSize;
  dateFormat?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showToday?: boolean;
  showOutsideDays?: boolean;
  error?: string;
}

export interface UiCalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
}
