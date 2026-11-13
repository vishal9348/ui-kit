import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiTooltipDirective } from '../../../lib/components/tooltip/ui-tooltip.directive';

const meta: Meta = {
  title: 'Components/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [UiTooltipDirective],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const Positions: Story = {
  render: () => ({
    template: `
      <div style="display:flex; align-items:center; justify-content:center; gap:32px; padding:100px;">
        <button uiTooltip="Tooltip appears at the top" uiTooltipPosition="top">Top</button>
        <button uiTooltip="Tooltip appears at the bottom" uiTooltipPosition="bottom">Bottom</button>
        <button uiTooltip="Tooltip appears on the left" uiTooltipPosition="left">Left</button>
        <button uiTooltip="Tooltip appears on the right" uiTooltipPosition="right">Right</button>
      </div>
    `,
  }),
};

export const CustomDelay: Story = {
  render: () => ({
    template: `
      <button uiTooltip="This tooltip appears after 800ms" [uiTooltipDelay]="800">
        Hover me
      </button>
    `,
  }),
};

export const ClickTrigger: Story = {
  render: () => ({
    template: `
      <button uiTooltip="Click outside or press Escape to close" uiTooltipTrigger="click">
        Click me
      </button>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <button uiTooltip="You should not see this tooltip" [uiTooltipDisabled]="true">
        Disabled tooltip
      </button>
    `,
  }),
};

export const LongContent: Story = {
  render: () => ({
    template: `
      <button
        uiTooltip="This is a longer tooltip message that wraps onto multiple lines when it reaches the configured maximum width."
        [uiTooltipMaxWidth]="280">
        Hover for details
      </button>
    `,
  }),
};
