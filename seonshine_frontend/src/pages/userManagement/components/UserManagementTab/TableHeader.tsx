import { Button } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';

export type UserType = {
  _id: string;
  name: string;
  age: number;
  job: string;
  country: string;
  status: string;
};

export const Columns: ColumnDef<UserType, unknown>[] = [
  {
    accessorKey: '_id',
    header: 'ID',
    cell: (user) => {
      return <span>{user.row.original._id || '---'}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Full name',
    cell: (user) => {
      return <span>{user.row.original.name || '---'}</span>;
    },
  },
  {
    accessorKey: 'country',
    header: 'Branch',
    cell: (user) => {
      return <span>{user.row.original.country || '---'}</span>;
    },
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: () => {
      return (
        <Button
          variant="text"
          color="primary"
        >
          View
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status of user',
    cell: (user) => {
      return <span>{user.row.original.status || '---'}</span>;
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: (user) => {
      return (
        <Button
          variant="contained"
          color={user.row.original.status === 'Active' ? 'error' : 'primary'}
        >
          {user.row.original.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
      );
    },
  },
];
