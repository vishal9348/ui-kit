import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiEllipsisComponent } from '../../../lib/components/ellipsis/ui-ellipsis.component';

const meta: Meta = {
  title: 'Components/Ellipsis',
  decorators: [
    moduleMetadata({
      imports: [UiEllipsisComponent],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const SingleLine: Story = {
  render: () => ({
    props: {
      text: 'This is a very long text that will be truncated when it exceeds the available width.',
    },
    template: `
      <ui-ellipsis
        [text]="text"
        [maxWidth]="220"
      />
    `,
  }),
};

export const MultipleLines: Story = {
  render: () => ({
    props: {
      text: 'This is a longer description that demonstrates multiline truncation. When the content exceeds the configured number of lines, the remaining text will be hidden and an ellipsis will be displayed.',
    },
  }),
  template: `
    <ui-ellipsis
      [text]="text"
      [maxWidth]="250"
      [lines]="2"
      tooltipPosition="bottom"
    />
  `,
};

export const WithoutTooltip: Story = {
  render: () => ({
    props: {
      text: 'This text will be truncated but no tooltip will appear.',
    },
    template: `
      <ui-ellipsis
        [text]="text"
        [maxWidth]="180"
        [showTooltip]="false"
      />
    `,
  }),
};

export const ShortText: Story = {
  render: () => ({
    props: {
      text: 'Short text',
    },
    template: `
      <ui-ellipsis
        [text]="text"
        [maxWidth]="220"
      />
    `,
  }),
};
