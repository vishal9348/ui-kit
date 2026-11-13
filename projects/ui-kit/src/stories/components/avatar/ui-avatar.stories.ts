import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiAvatarComponent } from '../../../lib/components/avatar/ui-avatar.component';

const meta: Meta = {
  title: 'Components/Avatar',
  decorators: [
    moduleMetadata({
      imports: [UiAvatarComponent],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `
      <ui-avatar name="Vishal Kumar" />
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:16px">
        <ui-avatar name="Vishal Kumar" size="xs" />
        <ui-avatar name="Vishal Kumar" size="sm" />
        <ui-avatar name="Vishal Kumar" size="md" />
        <ui-avatar name="Vishal Kumar" size="lg" />
        <ui-avatar name="Vishal Kumar" size="xl" />
        <ui-avatar name="Vishal Kumar" [size]="80" />
      </div>
    `,
  }),
};

export const Shapes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:20px">
        <ui-avatar name="John Doe" shape="circle" size="xl" />
        <ui-avatar name="John Doe" shape="square" size="xl" />
      </div>
    `,
  }),
};

export const Statuses: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:24px">
        <ui-avatar name="Online User" status="online" size="lg" />
        <ui-avatar name="Away User" status="away" size="lg" />
        <ui-avatar name="Busy User" status="busy" size="lg" />
        <ui-avatar name="Offline User" status="offline" size="lg" />
      </div>
    `,
  }),
};

export const Image: Story = {
  render: () => ({
    template: `
      <ui-avatar
        src="https://i.pravatar.cc/150?img=12"
        name="John Doe"
        size="xl"
      />
    `,
  }),
};

export const ImageFallback: Story = {
  render: () => ({
    template: `
      <ui-avatar
        src="https://invalid.example/avatar.jpg"
        name="John Doe"
        size="xl"
      />
    `,
  }),
};

export const CustomSize: Story = {
  render: () => ({
    template: `
      <ui-avatar
        name="Custom Size"
        [size]="80"
      />
    `,
  }),
};

export const EmptyAvatar: Story = {
  render: () => ({
    template: `
      <ui-avatar size="xl" />
    `,
  }),
};
