import type { Meta, StoryObj } from '@storybook/angular-vite';

import { UiAccordionComponent } from '../../../lib/components/accordion/ui-accordion.component';
import { UiAccordionItem } from '../../../lib/components/accordion/ui-accordion.types';

const accordionItems: UiAccordionItem[] = [
  {
    id: 'general',
    title: 'General Information',
    content: 'This section contains general information about the application and its features.',
  },
  {
    id: 'account',
    title: 'Account Settings',
    content: 'Manage your account details, profile information, and security preferences here.',
  },
  {
    id: 'billing',
    title: 'Billing Information',
    content: 'View your billing history, payment methods, and subscription details.',
  },
];

const meta: Meta<UiAccordionComponent> = {
  title: 'Components/Accordion',
  component: UiAccordionComponent,
  tags: ['autodocs'],
  args: {
    items: accordionItems,
    mode: 'single',
    multiple: false,
    bordered: true,
    showIcons: true,
    id: 'storybook-accordion',
  },
};

export default meta;

type Story = StoryObj<UiAccordionComponent>;

export const Default: Story = {};

export const Multiple: Story = {
  args: {
    mode: 'multiple',
  },
};

export const InitiallyExpanded: Story = {
  args: {
    items: [
      {
        id: 'first',
        title: 'First Panel',
        content: 'This panel is expanded initially.',
        expanded: true,
      },
      {
        id: 'second',
        title: 'Second Panel',
        content: 'This panel is collapsed initially.',
      },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...accordionItems,
      {
        id: 'disabled',
        title: 'Disabled Section',
        content: 'This content cannot be expanded.',
        disabled: true,
      },
    ],
  },
};

export const WithoutBorder: Story = {
  args: {
    bordered: false,
  },
};

export const WithoutIcons: Story = {
  args: {
    showIcons: false,
  },
};
