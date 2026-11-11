import type { Meta, StoryObj } from '@storybook/angular';

import { UiBreadcrumbComponent } from '../../../lib/components/breadcrumb/ui-breadcrumb.component';

const meta: Meta<UiBreadcrumbComponent> = {
  title: 'Components/Breadcrumb',
  component: UiBreadcrumbComponent,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Employees', href: '/employees' },
      { label: 'Employee Details' },
    ],
    separator: '/',
  },
};

export default meta;

type Story = StoryObj<UiBreadcrumbComponent>;

export const Default: Story = {};

export const ArrowSeparator: Story = {
  args: {
    separator: '>',
  },
};

export const MultipleLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Administration', href: '/admin' },
      { label: 'Employees', href: '/employees' },
      { label: 'Employee Details', href: '/employees/1' },
      { label: 'Edit Profile' },
    ],
  },
};

export const DisabledItem: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Administration', disabled: true },
      { label: 'Settings' },
    ],
  },
};
