import { Link } from 'react-router-dom';

import { Button, Typography } from '@mui/material';

import { CustomColumnDef } from '@/types/table';
import { labelRoleById, WaitingUserType } from '@/types/user';

export const ApprovalTableHeader = (
  handleAction: (userId: string) => void,
  pageCount: number,
): CustomColumnDef<WaitingUserType>[] => [
  {
    accessorKey: 'no',
    header: 'No',
    cell: (user) => {
      return pageCount + user.row.index + 1;
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
    accessorKey: 'role_id',
    header: 'Type',
    cell: (user) => {
      return labelRoleById[user.row.original.role_id];
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (user) => {
      return (
        <Link to={`mailto: ${user.row.original.email}`}>
          <Typography
            variant="bodyS"
            className="text-blue-500 underline"
          >
            {user.row.original.email}
          </Typography>
        </Link>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: (user) => {
      return (
        <Button
          variant="contained"
          onClick={() => {
            handleAction(user.row.original.user_id);
          }}
          sx={({ palette }) => ({
            backgroundColor: palette.green[300],
            fontSize: '14px',
            fontWeight: 400,
            paddingBlock: '6px',
            paddingInline: '16px',
            width: {
              xs: '80%',
              md: '50%',
              xl: '40%',
            },
            minWidth: 'min-content',
            borderRadius: '30px',
            boxShadow: 'none',
            ':hover': {
              backgroundColor: palette.green[500],
              boxShadow: 'none',
            },
          })}
        >
          Approve
        </Button>
      );
    },
    align: 'center',
    enableSorting: false,
  },
];
