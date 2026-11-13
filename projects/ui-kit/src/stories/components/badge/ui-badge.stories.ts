import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiBadgeComponent } from '../../../lib/components/badge/ui-badge.component';

const meta: Meta = {
  title: 'Components/Badge',
  decorators: [
    moduleMetadata({
      imports: [UiBadgeComponent],
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
    template: `<ui-badge label="Active" />`,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
        <ui-badge label="Primary" variant="primary" />
        <ui-badge label="Secondary" variant="secondary" />
        <ui-badge label="Success" variant="success" />
        <ui-badge label="Warning" variant="warning" />
        <ui-badge label="Danger" variant="danger" />
        <ui-badge label="Info" variant="info" />
        <ui-badge label="Neutral" variant="neutral" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:12px">
        <ui-badge label="Small" size="sm" />
        <ui-badge label="Medium" size="md" />
        <ui-badge label="Large" size="lg" />
      </div>
    `,
  }),
};

export const Shapes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:12px">
        <ui-badge label="Rounded" shape="rounded" />
        <ui-badge label="Pill" shape="pill" />
      </div>
    `,
  }),
};

export const Counts: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:16px">
        <ui-badge [count]="5" variant="primary" />
        <ui-badge [count]="25" variant="success" />
        <ui-badge [count]="99" variant="warning" />
        <ui-badge [count]="120" [maxCount]="99" variant="danger" />
      </div>
    `,
  }),
};

export const DotIndicators: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:16px">
        <ui-badge dot variant="success" />
        <ui-badge dot variant="warning" />
        <ui-badge dot variant="danger" />
        <ui-badge dot variant="info" />
        <ui-badge dot variant="neutral" />
      </div>
    `,
  }),
};

export const ZeroCount: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:16px">
        <ui-badge [count]="0" />
        <ui-badge [count]="0" [showZero]="true" variant="success" />
      </div>
    `,
  }),
};

export const StatusLabels: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:12px">
        <ui-badge label="Active" variant="success" />
        <ui-badge label="Pending" variant="warning" />
        <ui-badge label="Rejected" variant="danger" />
        <ui-badge label="In Review" variant="info" />
        <ui-badge label="Draft" variant="neutral" />
      </div>
    `,
  }),
};
