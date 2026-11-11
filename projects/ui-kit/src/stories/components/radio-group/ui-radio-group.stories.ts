import type { Meta, StoryObj } from '@storybook/angular';

import { UiRadioGroupComponent } from '../../../lib/components/radio-group/ui-radio-group.component';
import { UiRadioOption } from '../../../lib/components/radio-group/ui-radio-group.types';

const options: UiRadioOption<string>[] = [
  {
    label: 'Engineering',
    value: 'engineering',
    description: 'Software development and technology',
  },
  {
    label: 'Human Resources',
    value: 'hr',
    description: 'People and recruitment',
  },
  {
    label: 'Finance',
    value: 'finance',
  },
];

const meta: Meta<UiRadioGroupComponent> = {
  title: 'Components/Radio Group',
  component: UiRadioGroupComponent,
  tags: ['autodocs'],
  args: {
    label: 'Select Department',
    options,
  },
};

export default meta;

type Story = StoryObj<UiRadioGroupComponent>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: 'Engineering', value: 'engineering' },
      { label: 'HR', value: 'hr', disabled: true },
      { label: 'Finance', value: 'finance' },
    ],
  },
};

export const Required: Story = {
  args: {
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

export const WithoutDescription: Story = {
  args: {
    description: undefined,
  },
};
