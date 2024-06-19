import { Button, Typography } from '@mui/material';

import { CustomColumnDef } from '@/types/table';
import { labelUserStatus, RestaurantType, UserStatusEnum } from '@/types/user';

export const RestaurantTableHeader = (
  handleView: () => void,
  handleAction: (userId: string, userStatus: UserStatusEnum) => void,
): CustomColumnDef<RestaurantType>[] => [
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
    header: 'Restaurant name',
    cell: (user) => {
      return user.row.original.username || '...';
    },
  },
  {
    accessorKey: 'weekday',
    header: 'Assigned to',
    cell: (user) => {
      return (
        <Typography
          variant="bodyS"
          className="text-black-300"
        >
          {user.row.original.weekday || 'None'}
        </Typography>
      );
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
          onClick={handleView}
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
          onClick={() => {
            handleAction(user.row.original.user_id, user.row.original.user_status);
          }}
          sx={({ palette }) => ({
            backgroundColor:
              user.row.original.user_status == UserStatusEnum.ACTIVE ? palette.red[200] : palette.blue[400],
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
              backgroundColor:
                user.row.original.user_status == UserStatusEnum.ACTIVE ? palette.red[200] : palette.blue[400],
            },
          })}
        >
          {user.row.original.user_status == UserStatusEnum.ACTIVE ? 'Deactivate' : 'Activate'}
        </Button>
      );
    },
    align: 'center',
    enableSorting: false,
  },
];
