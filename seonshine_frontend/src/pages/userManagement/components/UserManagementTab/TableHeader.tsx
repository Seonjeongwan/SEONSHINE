import { Button } from '@mui/material';

import { CustomColumnDef } from '@/types/table';
import { labelUserStatus, UserType } from '@/types/user';

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
    accessorKey: 'user_id',
    header: 'ID',
    cell: (user) => {
      return user.row.original.user_id || '...';
    },
  },
  {
    accessorKey: 'username',
    header: 'Full name',
    cell: (user) => {
      return user.row.original.username || '...';
    },
  },
  {
    accessorKey: 'branch_name',
    header: 'Branch',
    cell: (user) => {
      return user.row.original.branch_name || '...';
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
    enableSorting: false,
  },
  {
    accessorKey: 'user_status',
    header: 'Status of user',
    cell: (user) => {
      const status = user.row.original.user_status;
      return labelUserStatus[status];
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
            backgroundColor: user.row.original.user_status === '1' ? palette.red[200] : palette.blue[400],
            fontSize: '13px',
            fontWeight: 400,
            width: {
              xs: '80%',
              md: '50%',
              xl: '40%',
            },
            borderRadius: '30px',
            boxShadow: 'none',
            ':hover': {
              backgroundColor: user.row.original.user_status === '1' ? palette.red[200] : palette.blue[400],
            },
          })}
        >
          {user.row.original.user_status === '1' ? 'Deactivate' : 'Activate'}
        </Button>
      );
    },
    align: 'center',
    enableSorting: false,
  },
];
