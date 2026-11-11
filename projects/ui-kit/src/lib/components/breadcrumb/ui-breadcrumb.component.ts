import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { UiBreadcrumbConfig, UiBreadcrumbItem } from './ui-breadcrumb.types';

@Component({
  selector: 'ui-breadcrumb',
  standalone: true,
  templateUrl: './ui-breadcrumb.component.html',
  styleUrl: './ui-breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiBreadcrumbComponent {
  readonly config = input<UiBreadcrumbConfig>({});

  readonly items = input<UiBreadcrumbItem[] | undefined>();

  readonly separator = input<string | undefined>();

  readonly ariaLabel = input<string | undefined>();

  readonly itemClick = output<UiBreadcrumbItem>();

  readonly resolvedItems = computed(() => this.items() ?? this.config().items ?? []);

  readonly resolvedSeparator = computed(() => this.separator() ?? this.config().separator ?? '/');

  readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.config().ariaLabel ?? 'Breadcrumb',
  );

  handleItemClick(item: UiBreadcrumbItem): void {
    this.itemClick.emit(item);
  }
}
