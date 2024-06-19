import { Button } from '@mui/material';

import { OrderListType } from '@/types/order';
import { CustomColumnDef } from '@/types/table';

export const OrderListHeader = (): CustomColumnDef<OrderListType>[] => [
  {
    accessorKey: 'no',
    header: 'No.',
    cell: (user) => {
      return user.row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'username',
    header: 'Restaurant',
    cell: (user) => {
      return user.row.original.username || '...';
    },
  },
  {
    accessorKey: 'odered_items',
    header: 'Ordered Items',
    cell: (user) => {
      return user.row.original.odered_items || '...';
    },
  },
  {
    accessorKey: 'date',
    header: 'Order submitted date',
    cell: (user) => {
      return user.row.original.date || '...';
    },
  },
];
