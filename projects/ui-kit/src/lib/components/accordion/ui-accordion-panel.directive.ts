import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: 'ng-template[uiAccordionPanel]',
  standalone: true,
})
export class UiAccordionPanelDirective {
  readonly itemId = input.required<string>({
    alias: 'uiAccordionPanel',
  });

  readonly templateRef = inject(TemplateRef<unknown>);
}
