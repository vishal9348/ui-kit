import type { Meta, StoryObj } from '@storybook/angular';

import { UiDialogComponent } from '../../../lib/components/dialog/ui-dialog.component';

const meta: Meta<UiDialogComponent> = {
  title: 'Components/Dialog',
  component: UiDialogComponent,
  tags: ['autodocs'],
  args: {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to continue?',
    variant: 'info',
    mode: 'confirm',
    confirmText: 'Continue',
    cancelText: 'Cancel',
  },
};

export default meta;

type Story = StoryObj<UiDialogComponent>;

export const Confirmation: Story = {};

export const Information: Story = {
  args: {
    mode: 'alert',
    variant: 'info',
    title: 'Information',
    message: 'Your changes have been saved.',
    confirmText: 'Got it',
  },
};

export const Success: Story = {
  args: {
    mode: 'alert',
    variant: 'success',
    title: 'Success',
    message: 'Employee details have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    message: 'This action may affect existing records.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Delete Employee',
    message: 'This action cannot be undone.',
    confirmText: 'Delete',
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
