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
    accessorKey: 'restaurant_name',
    header: 'Restaurant',
    cell: (user) => {
      return user.row.original.restaurant_name || '...';
    },
  },
  {
    accessorKey: 'employee_name',
    header: 'Employee Name',
    cell: (user) => {
      return user.row.original.employee_name || '...';
    },
  },
  {
    accessorKey: 'ordered_items',
    header: 'Ordered Items',
    cell: (user) => {
      return user.row.original.ordered_items || '...';
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
