import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  input,
  output,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ui-tooltip-panel',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass],
  templateUrl: './ui-tooltip-panel.component.html',
  styleUrl: './ui-tooltip-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTooltipPanelComponent {
  readonly content = input<string | TemplateRef<unknown>>('');

  readonly tooltipId = input.required<string>();

  readonly maxWidth = input<number>(240);

  readonly customClass = input<string>('');

  readonly pointerEntered = output<void>();

  readonly pointerLeft = output<void>();

  readonly templateContent = computed(() => {
    const value = this.content();

    return value instanceof TemplateRef ? value : null;
  });

  readonly textContent = computed(() => {
    const value = this.content();

    return typeof value === 'string' ? value : '';
  });
}
