import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { Component, signal, input } from '@angular/core';

import { UiStepperComponent } from '../../../lib/components/stepper/ui-stepper.component';
import { UiStepperContentDirective } from '../../../lib/components/stepper/ui-stepper-content.directive';
import {
  UiStepperOrientation,
  UiStepperStep,
} from '../../../lib/components/stepper/ui-stepper.types';

@Component({
  selector: 'ui-stepper-story-demo',
  standalone: true,
  imports: [UiStepperComponent, UiStepperContentDirective],
  template: `
    <ui-stepper
      [steps]="steps()"
      [activeStep]="activeStep()"
      [linear]="linear()"
      [orientation]="orientation()"
      (stepChange)="activeStep.set($event)"
      (completed)="onCompleted()"
    >
      <ng-template uiStepperContent="account">
        <h3>Account details</h3>
        <p>Enter your account information.</p>
      </ng-template>

      <ng-template uiStepperContent="profile">
        <h3>Profile information</h3>
        <p>Complete your profile details.</p>
      </ng-template>

      <ng-template uiStepperContent="review">
        <h3>Review details</h3>
        <p>Review your information before completing.</p>
      </ng-template>
    </ui-stepper>
  `,
})
class StepperStoryDemo {
  readonly activeStep = signal(0);
  readonly linear = signal(false);
  // readonly orientation = signal<UiStepperOrientation>('horizontal');
  readonly orientation = input<UiStepperOrientation>('horizontal');

  readonly steps = signal<UiStepperStep[]>([
    {
      id: 'account',
      label: 'Account',
      description: 'Create account',
    },
    {
      id: 'profile',
      label: 'Profile',
      description: 'Your details',
    },
    {
      id: 'review',
      label: 'Review',
      description: 'Confirm details',
    },
  ]);

  onCompleted(): void {
    console.log('Stepper completed');
  }
}

const meta: Meta<StepperStoryDemo> = {
  title: 'Components/Stepper',
  component: StepperStoryDemo,
  decorators: [
    moduleMetadata({
      imports: [StepperStoryDemo],
    }),
  ],
};

export default meta;

type Story = StoryObj<StepperStoryDemo>;

export const Default: Story = {
  render: () => ({
    template: '<ui-stepper-story-demo />',
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <ui-stepper-story-demo orientation="vertical" />
    `,
  }),
};
