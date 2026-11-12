import { type Meta, type StoryObj } from '@storybook/angular-vite';
import { UiDatePickerComponent } from '../../../lib/components/date-picker/ui-date-picker.component';

const meta: Meta<UiDatePickerComponent> = {
  title: 'Form Components/Date Picker',
  component: UiDatePickerComponent,
  tags: ['autodocs'],
  args: {
    label: 'Select date',
    placeholder: 'Choose a date',
    selectionMode: 'single',
    size: 'md',
    dateFormat: 'dd/MM/yyyy',
    clearable: true,
    showToday: true,
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'range'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    dateFormat: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    readonly: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    showToday: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<UiDatePickerComponent>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small date picker',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large date picker',
  },
};

export const DateOfBirth: Story = {
  args: {
    label: 'Date of Birth',
    placeholder: 'DD/MM/YYYY',
    dateFormat: 'dd/MM/yyyy',
    minDate: new Date(1950, 0, 1),
    maxDate: new Date(),
  },
};

export const DateRange: Story = {
  args: {
    label: 'Travel Period',
    selectionMode: 'range',
    placeholder: 'Select travel dates',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled date picker',
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Appointment Date',
    error: 'Please select a valid appointment date.',
  },
};
