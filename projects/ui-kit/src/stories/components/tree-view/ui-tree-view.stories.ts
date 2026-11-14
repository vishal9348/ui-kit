import type { Meta, StoryObj } from '@storybook/angular-vite';
import { UiTreeViewComponent } from '../../../lib/components/tree-view/ui-tree-view.component';
import { UiTreeNode } from '../../../lib/components/tree-view/ui-tree-view.types';

const sampleNodes: UiTreeNode[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      {
        id: 'work',
        label: 'Work',
        children: [
          { id: 'resume', label: 'Resume.pdf' },
          { id: 'report', label: 'Annual Report.docx' },
        ],
      },
      {
        id: 'personal',
        label: 'Personal',
        children: [
          { id: 'notes', label: 'Notes.txt' },
          { id: 'photo', label: 'Profile.png' },
        ],
      },
    ],
  },
  {
    id: 'pictures',
    label: 'Pictures',
    children: [
      { id: 'vacation', label: 'Vacation.jpg' },
      { id: 'family', label: 'Family.png' },
    ],
  },
  {
    id: 'downloads',
    label: 'Downloads',
    children: [
      { id: 'archive', label: 'Archive.zip' },
      { id: 'installer', label: 'Installer.exe', disabled: true },
    ],
  },
];

const meta: Meta<UiTreeViewComponent> = {
  title: 'Components/Tree View',
  component: UiTreeViewComponent,
  tags: ['autodocs'],
  args: {
    nodes: sampleNodes,
    selectionMode: 'single',
    selectedIds: [],
    checkedIds: [],
    expandedIds: ['documents', 'work'],
    selectable: true,
    checkboxes: false,
    searchable: false,
    showExpandAll: true,
    disabled: false,
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
  },
};

export default meta;

type Story = StoryObj<UiTreeViewComponent>;

export const Default: Story = {};

export const MultipleSelection: Story = {
  args: {
    selectionMode: 'multiple',
    selectedIds: ['resume', 'vacation'],
  },
};

export const WithCheckboxes: Story = {
  args: {
    checkboxes: true,
    expandedIds: ['documents', 'work', 'personal'],
    checkedIds: ['resume', 'report'],
  },
};

export const Searchable: Story = {
  args: {
    searchable: true,
    expandedIds: ['documents', 'work', 'personal', 'pictures'],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Expanded: Story = {
  args: {
    expandedIds: ['documents', 'work', 'personal', 'pictures', 'downloads'],
  },
};
