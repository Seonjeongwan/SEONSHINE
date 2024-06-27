import { OrderListType } from '@/types/order';
import { CustomColumnDef } from '@/types/table';

export const OrderListRestaurantTableHeader: CustomColumnDef<OrderListType>[] = [
  {
    accessorKey: 'no',
    header: 'No',
    cell: (order) => {
      return order.row.index + 1;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ordered_items',
    header: 'Order Items',
    cell: (order) => {
      return order.row.original.ordered_items || '...';
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: (order) => {
      return order.row.original.amount || '...';
    },
    align: 'center',
  },
];
