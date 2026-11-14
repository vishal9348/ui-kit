import { TemplateRef } from '@angular/core';

export type UiStepperOrientation = 'horizontal' | 'vertical';

export interface UiStepperStep {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
  disabled?: boolean;
  error?: boolean;
  optional?: boolean;
  content?: string;
}

export interface UiStepperTemplateContext {
  $implicit: UiStepperStep;
  step: UiStepperStep;
  index: number;
}
