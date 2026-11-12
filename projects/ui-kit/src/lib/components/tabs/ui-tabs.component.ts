import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  QueryList,
  ViewChildren,
  contentChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { UiTab, UiTabsConfig, UiTabsOrientation, UiTabsSize, UiTabsVariant } from './ui-tabs.types';

import { UiTabContentDirective } from './ui-tab-content.directive';

let nextTabsId = 0;

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './ui-tabs.component.html',
  styleUrl: './ui-tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTabsComponent {
  readonly tabs = input<UiTab[]>([]);
  readonly config = input<UiTabsConfig>({});

  readonly variant = input<UiTabsVariant | undefined>();
  readonly orientation = input<UiTabsOrientation | undefined>();
  readonly size = input<UiTabsSize | undefined>();
  readonly ariaLabel = input<string | undefined>();
  readonly id = input<string>(`ui-tabs-${++nextTabsId}`);

  readonly activeTab = model<string | null>(null);

  readonly tabContents = contentChildren(UiTabContentDirective);

  @ViewChildren('tabButton')
  private tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  readonly resolvedVariant = computed(() => this.variant() ?? this.config().variant ?? 'underline');

  readonly resolvedOrientation = computed(
    () => this.orientation() ?? this.config().orientation ?? 'horizontal',
  );

  readonly resolvedSize = computed(() => this.size() ?? this.config().size ?? 'md');

  readonly resolvedAriaLabel = computed(
    () => this.ariaLabel() ?? this.config().ariaLabel ?? 'Tabs',
  );

  readonly enabledTabs = computed(() => this.tabs().filter((tab) => !tab.disabled));

  readonly resolvedActiveTab = computed(() => {
    const selected = this.activeTab();

    return (
      this.enabledTabs().find((tab) => tab.id === selected)?.id ?? this.enabledTabs()[0]?.id ?? null
    );
  });

  // readonly activeContent = computed(() => {
  //   const activeId = this.resolvedActiveTab();

  //   return (
  //     this.tabContents().find((content) => content.uiTabContent() === activeId)?.template ?? null
  //   );
  // });

  contentFor(tabId: string) {
    return this.tabContents().find((content) => content.uiTabContent() === tabId)?.template ?? null;
  }

  readonly activePanelId = computed(() => `${this.id()}-panel-${this.resolvedActiveTab()}`);

  constructor() {
    effect(() => {
      const enabled = this.enabledTabs();
      const current = this.activeTab();

      if (!enabled.length) {
        if (current !== null) {
          this.activeTab.set(null);
        }
        return;
      }

      if (!enabled.some((tab) => tab.id === current)) {
        this.activeTab.set(enabled[0].id);
      }
    });
  }

  tabButtonId(tabId: string): string {
    return `${this.id()}-tab-${tabId}`;
  }

  tabPanelId(tabId: string): string {
    return `${this.id()}-panel-${tabId}`;
  }

  selectTab(tab: UiTab): void {
    if (tab.disabled || this.activeTab() === tab.id) {
      return;
    }

    this.activeTab.set(tab.id);
  }

  handleTabKeydown(event: KeyboardEvent, currentIndex: number): void {
    const orientation = this.resolvedOrientation();
    let nextIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
        if (orientation !== 'horizontal') return;
        nextIndex = this.findNextEnabledTab(currentIndex, 1);
        break;

      case 'ArrowLeft':
        if (orientation !== 'horizontal') return;
        nextIndex = this.findNextEnabledTab(currentIndex, -1);
        break;

      case 'ArrowDown':
        if (orientation !== 'vertical') return;
        nextIndex = this.findNextEnabledTab(currentIndex, 1);
        break;

      case 'ArrowUp':
        if (orientation !== 'vertical') return;
        nextIndex = this.findNextEnabledTab(currentIndex, -1);
        break;

      case 'Home':
        nextIndex = this.findFirstEnabledTab();
        break;

      case 'End':
        nextIndex = this.findLastEnabledTab();
        break;

      default:
        return;
    }

    event.preventDefault();

    if (nextIndex >= 0) {
      this.selectTab(this.tabs()[nextIndex]);
      this.tabButtons.get(nextIndex)?.nativeElement.focus();
    }
  }

  private findNextEnabledTab(currentIndex: number, direction: number): number {
    const tabs = this.tabs();

    if (!tabs.length) {
      return -1;
    }

    for (let attempts = 0; attempts < tabs.length; attempts++) {
      currentIndex = (currentIndex + direction + tabs.length) % tabs.length;

      if (!tabs[currentIndex].disabled) {
        return currentIndex;
      }
    }

    return -1;
  }

  private findFirstEnabledTab(): number {
    return this.tabs().findIndex((tab) => !tab.disabled);
  }

  private findLastEnabledTab(): number {
    const tabs = this.tabs();

    for (let index = tabs.length - 1; index >= 0; index--) {
      if (!tabs[index].disabled) {
        return index;
      }
    }

    return -1;
  }
}
