import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiChipComponent } from '../../../lib/components/chip/ui-chip.component';

const meta: Meta<UiChipComponent> = {
  title: 'Components/Chip',
  component: UiChipComponent,
  decorators: [
    moduleMetadata({
      imports: [UiChipComponent],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outlined', 'soft'],
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    selectable: {
      control: 'boolean',
    },
    removable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    selected: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<UiChipComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-chip
        [variant]="variant"
        [color]="color"
        [size]="size"
        [selectable]="selectable"
        [removable]="removable"
        [disabled]="disabled"
        [(selected)]="selected"
      >
        Angular
      </ui-chip>
    `,
  }),
  args: {
    variant: 'soft',
    color: 'primary',
    size: 'md',
    selectable: false,
    removable: false,
    disabled: false,
    selected: false,
  },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <ui-chip variant="filled" color="primary">Filled</ui-chip>
        <ui-chip variant="outlined" color="primary">Outlined</ui-chip>
        <ui-chip variant="soft" color="primary">Soft</ui-chip>
      </div>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <ui-chip color="primary">Primary</ui-chip>
        <ui-chip color="success">Success</ui-chip>
        <ui-chip color="warning">Warning</ui-chip>
        <ui-chip color="danger">Danger</ui-chip>
        <ui-chip color="neutral">Neutral</ui-chip>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; align-items:center;">
        <ui-chip size="sm">Small</ui-chip>
        <ui-chip size="md">Medium</ui-chip>
        <ui-chip size="lg">Large</ui-chip>
      </div>
    `,
  }),
};

export const Selectable: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px;">
        <ui-chip selectable color="primary">Angular</ui-chip>
        <ui-chip selectable color="success">React</ui-chip>
        <ui-chip selectable color="warning">Vue</ui-chip>
      </div>
    `,
  }),
};

export const Removable: Story = {
  render: () => ({
    props: {
      chips: ['Angular', 'Java', 'Spring Boot'],
      removeChip(name: string) {
        this['chips'] = this['chips'].filter((chip: string) => chip !== name);
      },
    },
    template: `
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        @for (chip of chips; track chip) {
          <ui-chip
            removable
            color="primary"
            (removed)="removeChip(chip)"
          >
            {{ chip }}
          </ui-chip>
        }
      </div>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px;">
        <ui-chip disabled>Disabled</ui-chip>
        <ui-chip disabled removable>Disabled removable</ui-chip>
        <ui-chip disabled selectable selected>Disabled selected</ui-chip>
      </div>
    `,
  }),
};
