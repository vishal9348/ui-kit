import type { Meta, StoryObj } from '@storybook/angular';
import { UiDataTableComponent } from '../../../lib/components/data-table/ui-data-table.component';

import type { UiTableColumn } from '../../../lib/components/data-table/ui-data-table.types';
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  salary: number;
  joiningDate: string;
  active: boolean;
}

const employees: Employee[] = [
  {
    id: 1,
    name: 'Vishal Kumar',
    email: 'vishal@example.com',
    department: 'Engineering',
    salary: 85000,
    joiningDate: '2023-01-15',
    active: true,
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    department: 'HR',
    salary: 65000,
    joiningDate: '2022-06-10',
    active: true,
  },
  {
    id: 3,
    name: 'Priya Singh',
    email: 'priya@example.com',
    department: 'Finance',
    salary: 75000,
    joiningDate: '2021-03-20',
    active: false,
  },
  {
    id: 4,
    name: 'Amit Patel',
    email: 'amit@example.com',
    department: 'Engineering',
    salary: 95000,
    joiningDate: '2020-11-05',
    active: true,
  },
  {
    id: 5,
    name: 'Sneha Verma',
    email: 'sneha@example.com',
    department: 'Marketing',
    salary: 70000,
    joiningDate: '2023-08-12',
    active: true,
  },
  {
    id: 6,
    name: 'Rohit Das',
    email: 'rohit@example.com',
    department: 'Engineering',
    salary: 105000,
    joiningDate: '2019-04-18',
    active: false,
  },
  {
    id: 7,
    name: 'Neha Gupta',
    email: 'neha@example.com',
    department: 'Finance',
    salary: 78000,
    joiningDate: '2022-09-25',
    active: true,
  },
  {
    id: 8,
    name: 'Karan Mehta',
    email: 'karan@example.com',
    department: 'HR',
    salary: 62000,
    joiningDate: '2024-01-08',
    active: true,
  },
  {
    id: 9,
    name: 'Anjali Roy',
    email: 'anjali@example.com',
    department: 'Marketing',
    salary: 72000,
    joiningDate: '2021-12-14',
    active: false,
  },
  {
    id: 10,
    name: 'Sandeep Kumar',
    email: 'sandeep@example.com',
    department: 'Engineering',
    salary: 110000,
    joiningDate: '2018-07-30',
    active: true,
  },
  {
    id: 11,
    name: 'Pooja Nair',
    email: 'pooja@example.com',
    department: 'Finance',
    salary: 81000,
    joiningDate: '2020-05-19',
    active: true,
  },
  {
    id: 12,
    name: 'Arjun Rao',
    email: 'arjun@example.com',
    department: 'Engineering',
    salary: 92000,
    joiningDate: '2022-02-11',
    active: true,
  },
];

const columns: UiTableColumn<Employee>[] = [
  {
    key: 'name',
    header: 'Employee Name',
    sortable: true,
    hideable: false,
    reorderable: false,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    key: 'department',
    header: 'Department',
    sortable: true,
  },
  {
    key: 'salary',
    header: 'Salary',
    type: 'currency',
    currency: 'INR',
    sortable: true,
    align: 'right',
  },
  {
    key: 'joiningDate',
    header: 'Joining Date',
    type: 'date',
    sortable: true,
  },
  {
    key: 'active',
    header: 'Active',
    type: 'boolean',
    sortable: true,
    align: 'center',
  },
];

const meta: Meta<UiDataTableComponent<Employee>> = {
  title: 'Components/Data Table',
  component: UiDataTableComponent,
  tags: ['autodocs'],
  args: {
    columns,
    data: employees,
    rowKey: 'id',
    searchable: true,
    pagination: true,
    selectable: true,
    multiSelect: true,
    pageSize: 5,
    pageSizeOptions: [5, 10, 25],
    showRowNumber: true,
    sortable: true,

    // Advanced column features
    columnManagement: true,
    columnReordering: true,
    columnResizing: true,
    columnFiltering: true,
  },
};

export default meta;

type Story = StoryObj<UiDataTableComponent<Employee>>;

export const Default: Story = {};

export const WithoutSearch: Story = {
  args: {
    searchable: false,
  },
};

export const WithoutPagination: Story = {
  args: {
    pagination: false,
  },
};

export const SingleSelection: Story = {
  args: {
    multiSelect: false,
  },
};

export const WithoutSelection: Story = {
  args: {
    selectable: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: 'No employees available.',
  },
};

export const Compact: Story = {
  args: {
    pageSize: 5,
    showRowNumber: false,
    selectable: false,
  },
};

export const WithoutColumnManagement: Story = {
  args: {
    columnManagement: false,
    columnReordering: false,
  },
};