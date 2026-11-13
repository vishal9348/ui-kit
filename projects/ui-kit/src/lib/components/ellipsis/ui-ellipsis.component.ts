import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  computed,
  input,
  signal,
} from '@angular/core';

import { UiTooltipDirective } from '../tooltip/ui-tooltip.directive';
import { UiTooltipPosition } from '../tooltip/ui-tooltip.types';

@Component({
  selector: 'ui-ellipsis',
  standalone: true,
  imports: [UiTooltipDirective],
  templateUrl: './ui-ellipsis.component.html',
  styleUrl: './ui-ellipsis.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiEllipsisComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('textElement')
  private textElement?: ElementRef<HTMLElement>;

  readonly text = input<string>('');

  readonly maxWidth = input<number | string>(200);

  readonly lines = input<number>(1);

  readonly showTooltip = input<boolean>(true);

  readonly tooltipPosition = input<UiTooltipPosition>('top');

  readonly isTruncated = signal(false);

  private resizeObserver?: ResizeObserver;

  readonly tooltipContent = computed(() => {
    return this.showTooltip() && this.isTruncated() ? this.text() : null;
  });

  readonly maxWidthStyle = computed(() => {
    const width = this.maxWidth();

    return typeof width === 'number' ? `${width}px` : width;
  });

  ngAfterViewInit(): void {
    this.observeElement();
    this.measureOverflow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] || changes['lines'] || changes['maxWidth']) {
      queueMicrotask(() => this.measureOverflow());
    }
  }

  private observeElement(): void {
    const element = this.textElement?.nativeElement;

    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.measureOverflow();
    });

    this.resizeObserver.observe(element);
  }

  private measureOverflow(): void {
    const element = this.textElement?.nativeElement;

    if (!element) {
      return;
    }

    const truncated =
      this.lines() <= 1
        ? element.scrollWidth > element.clientWidth
        : element.scrollHeight > element.clientHeight + 1;

    this.isTruncated.set(truncated);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
