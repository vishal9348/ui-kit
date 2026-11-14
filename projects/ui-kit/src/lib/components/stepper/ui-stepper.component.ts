import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { UiStepperContentDirective } from './ui-stepper-content.directive';
import { UiStepperOrientation, UiStepperStep, UiStepperTemplateContext } from './ui-stepper.types';

@Component({
  selector: 'ui-stepper',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './ui-stepper.component.html',
  styleUrl: './ui-stepper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiStepperComponent {
  readonly steps = input<UiStepperStep[]>([]);
  readonly activeStep = input(0);
  readonly orientation = input<UiStepperOrientation>('horizontal');

  readonly linear = input(true);
  readonly clickable = input(true);
  readonly showStepNumbers = input(true);
  readonly showNavigation = input(true);
  readonly canProceed = input(true);

  readonly nextLabel = input('Next');
  readonly previousLabel = input('Previous');
  readonly completeLabel = input('Complete');
  readonly id = input('ui-stepper');

  readonly stepChange = output<number>();
  readonly completed = output<void>();

  readonly stepTemplates = contentChildren(UiStepperContentDirective);

  readonly hasSteps = computed(() => this.steps().length > 0);

  readonly currentStep = computed(() => this.steps()[this.activeStep()] ?? null);

  readonly isFirstStep = computed(() => this.activeStep() <= 0);

  readonly isLastStep = computed(() => this.activeStep() === this.steps().length - 1);

  readonly progressPercentage = computed(() => {
    const total = this.steps().length;

    if (total <= 1) {
      return total === 1 ? 100 : 0;
    }

    return (this.activeStep() / (total - 1)) * 100;
  });

  isStepActive(index: number): boolean {
    return this.activeStep() === index;
  }

  isStepCompleted(step: UiStepperStep, index: number): boolean {
    return !!step.completed || index < this.activeStep();
  }

  isStepDisabled(index: number): boolean {
    const step = this.steps()[index];

    if (!step || step.disabled) {
      return true;
    }

    if (!this.clickable()) {
      return true;
    }

    if (!this.linear()) {
      return false;
    }

    if (index <= this.activeStep()) {
      return false;
    }

    return !this.steps()
      .slice(0, index)
      .every(
        (previousStep, previousIndex) =>
          previousStep.completed || previousIndex < this.activeStep(),
      );
  }

  selectStep(index: number): void {
    if (
      index < 0 ||
      index >= this.steps().length ||
      index === this.activeStep() ||
      this.isStepDisabled(index)
    ) {
      return;
    }

    this.stepChange.emit(index);
  }

  previous(): void {
    if (this.isFirstStep()) {
      return;
    }

    this.stepChange.emit(this.activeStep() - 1);
  }

  next(): void {
    if (!this.canProceed() || !this.hasSteps()) {
      return;
    }

    if (this.isLastStep()) {
      this.completed.emit();
      return;
    }

    const nextIndex = this.activeStep() + 1;
    const nextStep = this.steps()[nextIndex];

    if (!nextStep || nextStep.disabled) {
      return;
    }

    this.stepChange.emit(nextIndex);
  }

  getStepTemplate(stepId: string) {
    return (
      this.stepTemplates().find((template) => template.stepId() === stepId)?.templateRef ?? null
    );
  }

  getTemplateContext(step: UiStepperStep, index: number): UiStepperTemplateContext {
    return {
      $implicit: step,
      step,
      index,
    };
  }

  getStepId(stepId: string): string {
    return `${this.id()}-step-${stepId}`;
  }

  getPanelId(stepId: string): string {
    return `${this.id()}-panel-${stepId}`;
  }
}
