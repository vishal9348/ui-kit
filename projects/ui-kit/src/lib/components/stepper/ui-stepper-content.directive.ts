import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: 'ng-template[uiStepperContent]',
  standalone: true,
})
export class UiStepperContentDirective {
  readonly stepId = input.required<string>({
    alias: 'uiStepperContent',
  });

  readonly templateRef = inject(TemplateRef<unknown>);
}
