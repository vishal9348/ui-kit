import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';

import { UiTabsComponent } from '../../../lib/components/tabs/ui-tabs.component';
import { UiTabContentDirective } from '../../../lib/components/tabs/ui-tab-content.directive';
import { UiTab } from '../../../lib/components/tabs/ui-tabs.types';

const tabs: UiTab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '⌂',
    description: 'General information',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    description: 'Personal details',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙',
    description: 'Preferences',
  },
  {
    id: 'billing',
    label: 'Billing',
    disabled: true,
  },
];

const meta: Meta<UiTabsComponent> = {
  title: 'Navigation/Tabs',
  component: UiTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [UiTabContentDirective],
    }),
  ],
  tags: ['autodocs'],
  args: {
    tabs,
    variant: 'underline',
    orientation: 'horizontal',
    size: 'md',
    ariaLabel: 'Employee sections',
    activeTab: 'overview',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'underline', 'pills'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    activeTab: {
      control: 'select',
      options: ['overview', 'profile', 'settings', 'billing'],
    },
  },
};

export default meta;

type Story = StoryObj<UiTabsComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-tabs
        [tabs]="tabs"
        [variant]="variant"
        [orientation]="orientation"
        [size]="size"
        [ariaLabel]="ariaLabel"
        [(activeTab)]="activeTab"
      >
        <ng-template uiTabContent="overview">
          <h3>Overview</h3>
          <p>View your employee dashboard and summary information.</p>
        </ng-template>

        <ng-template uiTabContent="profile">
          <h3>Profile</h3>
          <p>Manage employee profile information.</p>
        </ng-template>

        <ng-template uiTabContent="settings">
          <h3>Settings</h3>
          <p>Configure your preferences and account settings.</p>
        </ng-template>
      </ui-tabs>
    `,
  }),
};

export const Pills: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: 'pills',
  },
};

export const DefaultVariant: Story = {
  ...Default,
  args: {
    ...Default.args,
    variant: 'default',
  },
};

export const Vertical: Story = {
  ...Default,
  args: {
    ...Default.args,
    orientation: 'vertical',
    variant: 'pills',
  },
};

export const Small: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'sm',
  },
};

export const Large: Story = {
  ...Default,
  args: {
    ...Default.args,
    size: 'lg',
  },
};

export const DisabledTab: Story = {
  ...Default,
  args: {
    ...Default.args,
    tabs: [...tabs.slice(0, 2), { id: 'restricted', label: 'Restricted', disabled: true }, tabs[2]],
  },
};
