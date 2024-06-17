import { Button } from '@mui/material';

import { CustomColumnDef } from '@/types/table';

export type UserType = {
  _id: string;
  name: string;
  age: number;
  job: string;
  country: string;
  status: string;
};

export const Columns: CustomColumnDef<UserType>[] = [
  {
    accessorKey: 'no',
    header: 'No',
    cell: (user) => {
      return user.row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: '_id',
    header: 'ID',
    cell: (user) => {
      return user.row.original._id || '...';
    },
  },
  {
    accessorKey: 'name',
    header: 'Full name',
    cell: (user) => {
      return user.row.original.name || '...';
    },
  },
  {
    accessorKey: 'country',
    header: 'Branch',
    cell: (user) => {
      return user.row.original.country || '...';
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
          className="hover:bg-transparent underline"
        >
          View
        </Button>
      );
    },
    align: 'center',
  },
  {
    accessorKey: 'status',
    header: 'Status of user',
    cell: (user) => {
      return user.row.original.status || '...';
    },
    align: 'center',
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: (user) => {
      return (
        <Button
          variant="contained"
          sx={({ palette }) => ({
            backgroundColor: user.row.original.status === 'Active' ? palette.red[200] : palette.blue[400],
            fontSize: '13px',
            fontWeight: 400,
            width: {
              xs: '50%',
              xl: '40%',
            },
            borderRadius: '30px',
            boxShadow: 'none',
            ':hover': {
              backgroundColor: user.row.original.status === 'Active' ? palette.red[200] : palette.blue[400],
            },
          })}
        >
          {user.row.original.status === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
      );
    },
    align: 'center',
  },
];
