import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiSelectComponent } from '../../../lib/components/select/ui-select.component';
import { UiSelectOption } from '../../../lib/components/select/ui-select.types';

const options: UiSelectOption[] = [
  { label: 'India', value: 'IN' },
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'UK' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Australia', value: 'AU' },
  { label: 'Canada', value: 'CA' },
];

const meta: Meta<UiSelectComponent> = {
  title: 'Components/Select',
  component: UiSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [UiSelectComponent],
    }),
  ],
  argTypes: {
    options: { control: 'object' },
    placeholder: { control: 'text' },
    searchable: { control: 'boolean' },
    clearable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<UiSelectComponent>;

export const Default: Story = {
  args: {
    id: 'country-select',
    label: 'Country',
    placeholder: 'Select a country',
    options,
  },
};

export const Searchable: Story = {
  args: {
    id: 'searchable-country',
    label: 'Search country',
    placeholder: 'Search and select',
    searchable: true,
    options,
  },
};

export const Clearable: Story = {
  args: {
    id: 'clearable-country',
    label: 'Country',
    placeholder: 'Select a country',
    clearable: true,
    options,
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-country',
    label: 'Country',
    placeholder: 'Country selection disabled',
    disabled: true,
    options,
  },
};

export const WithDisabledOption: Story = {
  args: {
    id: 'disabled-option-country',
    label: 'Country',
    options: [...options, { label: 'Not available', value: 'NA', disabled: true }],
  },
};
