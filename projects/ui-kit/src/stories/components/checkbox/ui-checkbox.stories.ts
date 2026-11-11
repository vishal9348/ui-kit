import type { Meta, StoryObj } from '@storybook/angular';

import { UiCheckboxComponent } from '../../../lib/components/checkbox/ui-checkbox.component';

const meta: Meta<UiCheckboxComponent> = {
  title: 'Components/Checkbox',
  component: UiCheckboxComponent,
  tags: ['autodocs'],
  args: {
    label: 'Accept Terms and Conditions',
    size: 'md',
    checked: false,
    disabled: false,
    indeterminate: false,
    required: false,
  },
};

export default meta;

type Story = StoryObj<UiCheckboxComponent>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Email Notifications',
    description: 'Receive important updates through email.',
  },
};

export const Required: Story = {
  args: {
    label: 'Accept Privacy Policy',
    required: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
