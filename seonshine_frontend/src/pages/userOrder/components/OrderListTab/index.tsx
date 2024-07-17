import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { OrderListType } from '@/types/order';

import { useGetOrderListDetailApi } from '@/apis/hooks/orderListApi.hook';
import useAuthStore from '@/store/auth.store';

import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 20;

const today = format(new Date(), 'yyyy-MM-dd');

const UserOrderListTab = () => {
  const { currentUser } = useAuthStore(); // ko dc

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: today, branch_id: currentUser?.branch_id },
  });

  const { currentPage, sortKey, sortType, pageSize, handlePageChange, handleSortingChange } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });

  const watchedDate = watch('date');
  const watchedBranchId = watch('branch_id');

  const { data: orderList, isFetching } = useGetOrderListDetailApi({
    params: { date: watchedDate, branch_id: watchedBranchId },
  });
  const columns = OrderListTableHeader;

  const data: OrderListType[] = orderList
    ? orderList.data.map((order) => ({
        restaurant_name: order.restaurant_name,
        employee_name: order.username,
        ordered_items: order.item_name,
        branch_name: order.branch_name,
        date: order.submitted_time,
      }))
    : [];

  return (
    <Stack
      direction="column"
      className="w-full"
    >
      <Stack
        className="px-4 md:px-6"
        justifyContent="space-between"
      >
        <Typography
          component="h4"
          className="text-xl md:text-2xl font-bold"
        >{`Order for ${watchedDate}`}</Typography>

        <Typography className="text-lg font-normal">{`Order user: ${orderList?.total}`}</Typography>
      </Stack>
      <Stack
        className="mb-2 px-4 md:px-6"
        justifyContent="space-between"
      >
        <Typography
          component="h4"
          className="text-xl md:text-2xl font-bold"
        >{`Branch: ${orderList?.data[0].branch_name}`}</Typography>
      </Stack>

      <Table<OrderListType>
        data={data}
        columns={columns}
        isFetching={isFetching}
        onSortingChange={handleSortingChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Stack>
  );
};

export default UserOrderListTab;
