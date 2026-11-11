import type { Meta, StoryObj } from '@storybook/angular';

import { UiLoaderComponent } from '../../../lib/components/loader/ui-loader.component';

const meta: Meta<UiLoaderComponent> = {
  title: 'Components/Loader',
  component: UiLoaderComponent,
  tags: ['autodocs'],
  args: {
    visible: true,
    size: 'md',
    variant: 'primary',
    text: 'Loading...',
  },
};

export default meta;

type Story = StoryObj<UiLoaderComponent>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const WithText: Story = {
  args: { text: 'Fetching employee records...' },
};

export const Overlay: Story = {
  args: {
    overlay: true,
    text: 'Loading application...',
  },
};

export const Fullscreen: Story = {
  args: {
    fullscreen: true,
    overlay: true,
    text: 'Please wait...',
  },
};
