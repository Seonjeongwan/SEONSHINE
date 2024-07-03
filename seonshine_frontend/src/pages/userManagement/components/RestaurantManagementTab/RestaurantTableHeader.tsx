import { Button, Typography } from '@mui/material';

import { CustomColumnDef } from '@/types/table';
import { dayByWeekday, DayEnum, labelUserStatus, RestaurantType, UserStatusEnum } from '@/types/user';

export const RestaurantTableHeader = (
  handleView: (userId: string) => void,
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
          {dayByWeekday[Number(user.row.original.weekday) as DayEnum] || 'None'}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: (user) => {
      return (
        <Button
          variant="text"
          color="primary"
          className="hover:bg-transparent underline text-md p-0"
          onClick={() => handleView(user.row.original.user_id)}
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
            fontSize: '14px',
            fontWeight: 400,
            padding: '6px',
            width: {
              xs: '80%',
              md: '50%',
              xl: '40%',
            },
            minWidth: 'min-content',
            borderRadius: '30px',
            boxShadow: 'none',
            ':hover': {
              backgroundColor:
                user.row.original.user_status == UserStatusEnum.ACTIVE ? palette.red[500] : palette.blue[500],
              boxShadow: 'none',
            },
          })}
        >
          {user.row.original.user_status == UserStatusEnum.ACTIVE ? 'Deactivate' : '\u00A0\u00A0Activate\u00A0\u00A0'}
        </Button>
      );
    },
    align: 'center',
    enableSorting: false,
  },
];
