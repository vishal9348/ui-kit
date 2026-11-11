import type { Meta, StoryObj } from '@storybook/angular';

import { UiProgressBarComponent } from '../../../lib/components/progress-bar/ui-progress-bar.component';

const meta: Meta<UiProgressBarComponent> = {
  title: 'Components/Progress Bar',
  component: UiProgressBarComponent,
  tags: ['autodocs'],
  args: {
    value: 65,
    label: 'Uploading file',
    showValue: true,
    size: 'md',
    variant: 'primary',
  },
};

export default meta;

type Story = StoryObj<UiProgressBarComponent>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    value: 100,
    variant: 'success',
    label: 'Completed',
  },
};

export const Warning: Story = {
  args: {
    value: 45,
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    value: 25,
    variant: 'danger',
  },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Striped: Story = {
  args: {
    striped: true,
    animated: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
    label: 'Processing request',
  },
};
