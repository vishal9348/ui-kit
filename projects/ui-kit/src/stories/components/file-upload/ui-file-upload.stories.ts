import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';

import { UiFileUploadComponent } from '../../../lib/components/file-upload/ui-file-upload.component';

const meta: Meta<UiFileUploadComponent> = {
  title: 'Components/File Upload',
  component: UiFileUploadComponent,
  decorators: [
    moduleMetadata({
      imports: [UiFileUploadComponent, FormsModule],
    }),
  ],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxFiles: { control: 'number' },
    maxFileSize: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showFileList: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<UiFileUploadComponent>;

export const Default: Story = {
  args: {
    id: 'default-upload',
    label: 'Upload document',
    hint: 'Drag and drop your document here, or browse',
  },
};

export const MultipleFiles: Story = {
  args: {
    id: 'multiple-upload',
    label: 'Upload documents',
    multiple: true,
    maxFiles: 5,
    hint: 'You can select up to 5 files',
  },
};

export const ImagesOnly: Story = {
  args: {
    id: 'image-upload',
    label: 'Upload images',
    accept: 'image/*',
    multiple: true,
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024,
    hint: 'PNG, JPG or GIF (maximum 5 MB per file)',
  },
};

export const PDFOnly: Story = {
  args: {
    id: 'pdf-upload',
    label: 'Upload PDF',
    accept: '.pdf,application/pdf',
    maxFileSize: 10 * 1024 * 1024,
    hint: 'PDF files only (maximum 10 MB)',
  },
};

export const Disabled: Story = {
  args: {
    id: 'disabled-upload',
    label: 'Upload document',
    disabled: true,
  },
};

export const WithoutFileList: Story = {
  args: {
    id: 'hidden-list-upload',
    label: 'Upload document',
    showFileList: false,
  },
};
