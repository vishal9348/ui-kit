import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { UiAccordionPanelDirective } from './ui-accordion-panel.directive';
import { UiAccordionItem, UiAccordionMode } from './ui-accordion.types';

@Component({
  selector: 'ui-accordion',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './ui-accordion.component.html',
  styleUrl: './ui-accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiAccordionComponent {
  readonly items = input<UiAccordionItem[]>([]);

  readonly mode = input<UiAccordionMode>('single');

  readonly multiple = input<boolean>(false);

  readonly bordered = input<boolean>(true);

  readonly showIcons = input<boolean>(true);

  readonly id = input<string>('ui-accordion');

  readonly expandedChange = output<string[]>();

  readonly panelTemplates = contentChildren(UiAccordionPanelDirective);

  private readonly expandedIds = signal<Set<string>>(new Set());

  private readonly initialized = signal(false);

  readonly allowMultiple = computed(() => this.multiple() || this.mode() === 'multiple');

  constructor() {
    effect(() => {
      const items = this.items();

      // Initialize expanded panels once, after items are supplied.
      if (this.initialized() || items.length === 0) {
        return;
      }

      const initiallyExpanded = items
        .filter((item) => item.expanded && !item.disabled)
        .map((item) => item.id);

      this.expandedIds.set(
        new Set(this.allowMultiple() ? initiallyExpanded : initiallyExpanded.slice(0, 1)),
      );

      this.initialized.set(true);
    });
  }

  isExpanded(itemId: string): boolean {
    return this.expandedIds().has(itemId);
  }

  toggle(item: UiAccordionItem): void {
    if (item.disabled) {
      return;
    }

    const next = new Set(this.expandedIds());

    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      if (!this.allowMultiple()) {
        next.clear();
      }

      next.add(item.id);
    }

    this.expandedIds.set(next);
    this.expandedChange.emit([...next]);
  }

  getPanelTemplate(item: UiAccordionItem) {
    return (
      item.contentTemplate ??
      this.panelTemplates().find((template) => template.itemId() === item.id)?.templateRef ??
      null
    );
  }

  getTemplateContext(item: UiAccordionItem) {
    return {
      $implicit: item,
      item,
    };
  }

  getHeaderId(itemId: string): string {
    return `${this.id()}-header-${itemId}`;
  }

  getPanelId(itemId: string): string {
    return `${this.id()}-panel-${itemId}`;
  }
}
