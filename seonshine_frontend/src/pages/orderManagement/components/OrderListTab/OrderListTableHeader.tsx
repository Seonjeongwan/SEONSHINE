import { OrderListType } from '@/types/order';
import { CustomColumnDef } from '@/types/table';

export const OrderListTableHeader: CustomColumnDef<OrderListType>[] = [
  {
    accessorKey: 'no',
    header: 'No',
    cell: (order) => {
      return order.row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'restaurant_name',
    header: 'Restaurant',
    cell: (order) => {
      return order.row.original.restaurant_name || '...';
    },
  },
  {
    accessorKey: 'employee_name',
    header: 'Full name',
    cell: (order) => {
      return order.row.original.employee_name || '...';
    },
  },
  {
    accessorKey: 'ordered_items',
    header: 'Order Items',
    cell: (order) => {
      return order.row.original.ordered_items || '...';
    },
  },
  {
    accessorKey: 'date',
    header: 'Order Submitted Date',
    cell: (order) => {
      return order.row.original.date || '...';
    },
  },
];
