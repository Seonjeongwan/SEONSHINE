import { OrderListDetailItemType, OrderListType } from '@/types/order';
import { CustomColumnDef } from '@/types/table';

export const OrderListHeader: CustomColumnDef<OrderListType>[] = [
  {
    accessorKey: 'no',
    header: 'No.',
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
    enableSorting: false,
  },
  {
    accessorKey: 'employee_name',
    header: 'Full name',
    cell: (order) => {
      return order.row.original.employee_name || '...';
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ordered_items',
    header: 'Order Items',
    cell: (order) => {
      return order.row.original.ordered_items || '...';
    },
    enableSorting: false,
  },
  {
    accessorKey: 'branch_name',
    header: 'Branch name',
    cell: (order) => {
      return order.row.original.branch_name || '...';
    },
    enableSorting: false,
  },
  {
    accessorKey: 'date',
    header: 'Order Submitted Date',
    cell: (order) => {
      return order.row.original.date || '...';
    },
    enableSorting: false,
  },
];
