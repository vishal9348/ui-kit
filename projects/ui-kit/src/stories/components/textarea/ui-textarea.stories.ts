import type { Meta, StoryObj } from '@storybook/angular';
import { UiTextareaComponent } from '../../../lib/components/textarea/ui-textarea.component';

const meta: Meta<UiTextareaComponent> = {
  title: 'Components/Textarea',
  component: UiTextareaComponent,
  tags: ['autodocs'],
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    rows: 4,
    showCounter: true,
    maxLength: 250,
  },
};

export default meta;

type Story = StoryObj<UiTextareaComponent>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Description is required.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Readonly: Story = {
  args: {
    readonly: true,
  },
};

export const NoResize: Story = {
  args: {
    resize: 'none',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
