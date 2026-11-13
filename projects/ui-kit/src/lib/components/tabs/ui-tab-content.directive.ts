import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: 'ng-template[uiTabContent]',
  standalone: true,
})
export class UiTabContentDirective {
  readonly uiTabContent = input.required<string>();

  readonly template = inject(TemplateRef<unknown>);
}
