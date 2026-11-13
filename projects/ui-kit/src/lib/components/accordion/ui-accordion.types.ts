import { TemplateRef } from '@angular/core';

export type UiAccordionMode = 'single' | 'multiple';

export interface UiAccordionItem {
  id: string;
  title: string;
  content?: string;
  contentTemplate?: TemplateRef<UiAccordionTemplateContext>;
  data?: unknown;
  disabled?: boolean;
  expanded?: boolean;
}

export interface UiAccordionTemplateContext {
  $implicit: UiAccordionItem;
  item: UiAccordionItem;
}
