import type { Meta, StoryObj } from '@storybook/angular';
import { UiInputComponent } from '../../../lib/components/input/ui-input.component';

const meta: Meta<UiInputComponent> = {
  title: 'Components/Input',
  component: UiInputComponent,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<UiInputComponent>;

export const Default: Story = {};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
  },
};

export const WithPrefix: Story = {
  args: {
    label: 'Salary',
    type: 'number',
    prefix: '₹',
  },
};

export const WithSuffix: Story = {
  args: {
    label: 'Website',
    type: 'text',
    suffix: '.com',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Please enter a valid email address.',
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
