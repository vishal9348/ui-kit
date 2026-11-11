import type { Meta, StoryObj } from '@storybook/angular';
import { UiSwitchComponent } from '../../../lib/components/switch/ui-switch.component';

const meta: Meta<UiSwitchComponent> = {
  title: 'Components/Switch',
  component: UiSwitchComponent,
  tags: ['autodocs'],
  args: {
    label: 'Email Notifications',
    description: 'Receive notifications through email.',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<UiSwitchComponent>;

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
