import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';

import {
  UiCalendarDay,
  UiDatePickerSelectionMode,
  UiDatePickerSize,
  UiDatePickerValue,
  UiDateRange,
} from './ui-date-picker.types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Component({
  selector: 'ui-date-picker',
  standalone: true,
  imports: [CdkOverlayOrigin, CdkConnectedOverlay],
  templateUrl: './ui-date-picker.component.html',
  styleUrl: './ui-date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiDatePickerComponent),
      multi: true,
    },
  ],
})
export class UiDatePickerComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('Select date');
  readonly selectionMode = input<UiDatePickerSelectionMode>('single');
  readonly size = input<UiDatePickerSize>('md');
  readonly dateFormat = input('dd/MM/yyyy');
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  readonly disabledDates = input<Date[]>([]);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly required = input(false);
  readonly clearable = input(true);
  readonly closeOnSelect = input(true);
  readonly weekStartsOn = input<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);
  readonly showToday = input(true);
  readonly showOutsideDays = input(true);
  readonly error = input('');

  readonly valueChange = output<UiDatePickerValue>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  readonly overlayOrigin = viewChild(CdkOverlayOrigin);
  readonly inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  readonly isOpen = signal(false);
  readonly value = signal<UiDatePickerValue>(null);
  readonly focusedDate = signal(this.startOfDay(new Date()));
  readonly visibleMonth = signal(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  readonly activeRangeStart = signal<Date | null>(null);
  readonly touched = signal(false);

  readonly weekdays = computed(() => {
    const start = this.weekStartsOn();
    return [...WEEKDAYS.slice(start), ...WEEKDAYS.slice(0, start)];
  });

  readonly monthLabel = computed(() => {
    const date = this.visibleMonth();
    return MONTHS[date.getMonth()];
  });

  readonly calendarDays = computed<UiCalendarDay[]>(() => {
    const month = this.visibleMonth();
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (firstDay.getDay() - this.weekStartsOn() + 7) % 7;
    const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - offset);

    const selected = this.value();
    const singleDate = selected instanceof Date ? this.startOfDay(selected) : null;
    const range = this.isRangeValue(selected) ? selected : null;
    const today = this.startOfDay(new Date());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      );

      const day = this.startOfDay(date);
      const start = range?.start ? this.startOfDay(range.start) : null;
      const end = range?.end ? this.startOfDay(range.end) : null;

      return {
        date,
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month.getMonth(),
        isToday: this.sameDay(day, today),
        isSelected:
          (singleDate !== null && this.sameDay(day, singleDate)) ||
          (start !== null && this.sameDay(day, start)) ||
          (end !== null && this.sameDay(day, end)),
        isInRange:
          start !== null &&
          end !== null &&
          day.getTime() >= start.getTime() &&
          day.getTime() <= end.getTime(),
        isRangeStart: start !== null && this.sameDay(day, start),
        isRangeEnd: end !== null && this.sameDay(day, end),
        isDisabled: this.isDateDisabled(day),
      };
    });
  });

  readonly displayValue = computed(() => {
    const value = this.value();

    if (value instanceof Date) {
      return this.formatDate(value);
    }

    if (this.isRangeValue(value)) {
      if (!value.start && !value.end) return '';
      if (value.start && !value.end) {
        return `${this.formatDate(value.start)} –`;
      }
      if (value.start && value.end) {
        return `${this.formatDate(value.start)} – ${this.formatDate(value.end)}`;
      }
    }

    return '';
  });

  readonly canGoPrevious = computed(() => {
    const min = this.minDate();
    if (!min) return true;

    const previousMonth = new Date(
      this.visibleMonth().getFullYear(),
      this.visibleMonth().getMonth() - 1,
      1,
    );

    return (
      previousMonth.getFullYear() > min.getFullYear() ||
      (previousMonth.getFullYear() === min.getFullYear() &&
        previousMonth.getMonth() >= min.getMonth())
    );
  });

  readonly canGoNext = computed(() => {
    const max = this.maxDate();
    if (!max) return true;

    const nextMonth = new Date(
      this.visibleMonth().getFullYear(),
      this.visibleMonth().getMonth() + 1,
      1,
    );

    return (
      nextMonth.getFullYear() < max.getFullYear() ||
      (nextMonth.getFullYear() === max.getFullYear() && nextMonth.getMonth() <= max.getMonth())
    );
  });

  readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 6,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -6,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 6,
    },
  ];

  private onChange: (value: UiDatePickerValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: UiDatePickerValue): void {
    if (value instanceof Date) {
      this.value.set(this.validDate(value) ? this.startOfDay(value) : null);
      this.visibleMonth.set(new Date(value.getFullYear(), value.getMonth(), 1));
      return;
    }

    if (this.isRangeValue(value)) {
      const start =
        value.start && this.validDate(value.start) ? this.startOfDay(value.start) : null;
      const end = value.end && this.validDate(value.end) ? this.startOfDay(value.end) : null;

      this.value.set({ start, end });
      const displayDate = start ?? end;
      if (displayDate) {
        this.visibleMonth.set(new Date(displayDate.getFullYear(), displayDate.getMonth(), 1));
      }
      return;
    }

    this.value.set(null);
  }

  registerOnChange(fn: (value: UiDatePickerValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  readonly disabledState = signal(false);

  openCalendar(): void {
    if (this.isEffectivelyDisabled() || this.readonly()) return;

    this.isOpen.set(true);
    this.focusedDate.set(this.startOfDay(new Date()));

    const current = this.value();
    const selectedDate =
      current instanceof Date ? current : this.isRangeValue(current) ? current.start : null;

    if (selectedDate) {
      this.visibleMonth.set(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
      this.focusedDate.set(this.startOfDay(selectedDate));
    }

    this.opened.emit();
  }

  closeCalendar(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.activeRangeStart.set(null);
    this.markTouched();
    this.closed.emit();
  }

  toggleCalendar(): void {
    this.isOpen() ? this.closeCalendar() : this.openCalendar();
  }

  goToPreviousMonth(): void {
    if (!this.canGoPrevious()) return;
    this.changeMonth(-1);
  }

  goToNextMonth(): void {
    if (!this.canGoNext()) return;
    this.changeMonth(1);
  }

  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    const selectedDate = this.startOfDay(date);

    if (this.selectionMode() === 'single') {
      this.updateValue(selectedDate);
      if (this.closeOnSelect()) this.closeCalendar();
      return;
    }

    const currentStart = this.activeRangeStart();

    if (!currentStart) {
      this.activeRangeStart.set(selectedDate);
      this.value.set({ start: selectedDate, end: null });
      this.focusedDate.set(selectedDate);
      return;
    }

    if (selectedDate.getTime() < currentStart.getTime()) {
      this.activeRangeStart.set(selectedDate);
      this.value.set({ start: selectedDate, end: null });
      return;
    }

    const range: UiDateRange = {
      start: currentStart,
      end: selectedDate,
    };

    this.activeRangeStart.set(null);
    this.updateValue(range);
    if (this.closeOnSelect()) this.closeCalendar();
  }

  selectToday(): void {
    const today = this.startOfDay(new Date());
    if (this.isDateDisabled(today)) return;

    this.visibleMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
    this.selectDate(today);
  }

  clearSelection(event?: Event): void {
    event?.stopPropagation();

    const emptyValue: UiDatePickerValue =
      this.selectionMode() === 'range' ? { start: null, end: null } : null;

    this.activeRangeStart.set(null);
    this.updateValue(emptyValue);
    this.inputElement()?.nativeElement.focus();
  }

  onCalendarKeydown(event: KeyboardEvent): void {
    const current = this.focusedDate();
    let next: Date | null = null;

    switch (event.key) {
      case 'ArrowLeft':
        next = this.addDays(current, -1);
        break;
      case 'ArrowRight':
        next = this.addDays(current, 1);
        break;
      case 'ArrowUp':
        next = this.addDays(current, -7);
        break;
      case 'ArrowDown':
        next = this.addDays(current, 7);
        break;
      case 'Home':
        next = this.addDays(current, -((current.getDay() - this.weekStartsOn() + 7) % 7));
        break;
      case 'End':
        next = this.addDays(current, 6 - ((current.getDay() - this.weekStartsOn() + 7) % 7));
        break;
      case 'PageUp':
        next = this.addMonths(current, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = this.addMonths(current, event.shiftKey ? 12 : 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectDate(current);
        return;
      case 'Escape':
        event.preventDefault();
        this.closeCalendar();
        return;
      default:
        return;
    }

    event.preventDefault();

    if (next) {
      this.focusedDate.set(next);
      this.visibleMonth.set(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  }

  isFocused(date: Date): boolean {
    return this.sameDay(date, this.focusedDate());
  }

  isEffectivelyDisabled(): boolean {
    return this.disabled() || this.disabledState();
  }

  private updateValue(value: UiDatePickerValue): void {
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
    this.markTouched();
  }

  private markTouched(): void {
    this.touched.set(true);
    this.onTouched();
  }

  private changeMonth(amount: number): void {
    const current = this.visibleMonth();
    this.visibleMonth.set(new Date(current.getFullYear(), current.getMonth() + amount, 1));
  }

  private isDateDisabled(date: Date): boolean {
    const day = this.startOfDay(date);
    const min = this.minDate();
    const max = this.maxDate();

    if (min && day.getTime() < this.startOfDay(min).getTime()) return true;
    if (max && day.getTime() > this.startOfDay(max).getTime()) return true;

    return this.disabledDates().some((disabledDate) => this.sameDay(day, disabledDate));
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return this.dateFormat().replace(/dd/g, day).replace(/MM/g, month).replace(/yyyy/g, year);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private sameDay(first: Date, second: Date): boolean {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  private addDays(date: Date, amount: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  private addMonths(date: Date, amount: number): Date {
    const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();

    return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
  }

  private validDate(date: Date): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  private isRangeValue(value: unknown): value is UiDateRange {
    return typeof value === 'object' && value !== null && 'start' in value && 'end' in value;
  }

  readonly yearOptions = computed(() => {
    const currentYear = new Date().getFullYear();

    const minYear = this.minDate()?.getFullYear() ?? currentYear - 100;
    const maxYear = this.maxDate()?.getFullYear() ?? currentYear + 100;

    if (minYear > maxYear) return [];

    return Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);
  });

  selectYear(year: number): void {
    if (!Number.isInteger(year)) return;

    const minYear = this.minDate()?.getFullYear();
    const maxYear = this.maxDate()?.getFullYear();

    if (minYear !== undefined && year < minYear) return;
    if (maxYear !== undefined && year > maxYear) return;

    const current = this.visibleMonth();

    this.visibleMonth.set(new Date(year, current.getMonth(), 1));

    this.focusedDate.set(new Date(year, current.getMonth(), 1));
  }
}
