import type { Meta, StoryObj } from '@storybook/angular';

import { UiDropdownComponent } from '../../../lib/components/dropdown/ui-dropdown.component';

const departments = [
  { label: 'Engineering', value: 101 },
  { label: 'Finance', value: 102 },
  { label: 'Human Resources', value: 103 },
  { label: 'Marketing', value: 104 },
  { label: 'Operations', value: 105 },
];

const meta: Meta<UiDropdownComponent> = {
  title: 'Components/Dropdown',
  component: UiDropdownComponent,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
    },
    config: {
      control: 'object',
    },
    placeholder: {
      control: 'text',
    },
    multiple: {
      control: 'boolean',
    },
    searchable: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<UiDropdownComponent>;

export const SingleSelect: Story = {
  args: {
    options: departments,
    placeholder: 'Select department',
    searchable: true,
    clearable: true,
  },
};

export const MultiSelect: Story = {
  args: {
    options: departments,
    placeholder: 'Select departments',
    multiple: true,
    searchable: true,
    clearable: true,
  },
};

export const Disabled: Story = {
  args: {
    options: departments,
    placeholder: 'Department unavailable',
    disabled: true,
  },
};

export const WithDisabledOption: Story = {
  args: {
    options: [
      ...departments,
      {
        label: 'Archived Department',
        value: 106,
        disabled: true,
      },
    ],
    placeholder: 'Select department',
  },
};

export const Loading: Story = {
  args: {
    options: [],
    loading: true,
    placeholder: 'Loading departments',
  },
};
