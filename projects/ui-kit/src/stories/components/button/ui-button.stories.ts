
import type { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from '../../../lib/components/button/ui-button.component';

const meta: Meta<UiButtonComponent> = {
  title: 'Components/Button',
  component: UiButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    config: {
      control: 'object',
    },
    label: {
      control: 'text',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    ariaLabel: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    config: {
      variant: 'primary',
      size: 'md',
    },
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    config: {
      variant: 'secondary',
      size: 'md',
    },
  },
};

export const Danger: Story = {
  args: {
    label: 'Delete',
    config: {
      variant: 'danger',
      size: 'md',
    },
  },
};

export const Loading: Story = {
  args: {
    label: 'Saving...',
    config: {
      variant: 'primary',
      loading: true,
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    config: {
      variant: 'primary',
      disabled: true,
    },
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Button',
    config: {
      variant: 'primary',
      fullWidth: true,
    },
  },
};
