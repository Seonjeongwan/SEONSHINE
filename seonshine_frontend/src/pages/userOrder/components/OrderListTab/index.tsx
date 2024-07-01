import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { OrderListType } from '@/types/order';

import { useGetOrderListDetailApi } from '@/apis/hooks/orderListApi.hook';

import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 20;

const today = format(new Date(), 'yyyy-MM-dd');

const UserOrderListTab = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: today },
  });

  const { currentPage, sortKey, sortType, pageSize, handlePageChange, handleSortingChange } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });

  const watchedDate = watch('date');

  const { data: orderList, isFetching } = useGetOrderListDetailApi({
    params: { date: watchedDate },
  });
  const columns = OrderListTableHeader;

  const data: OrderListType[] = orderList
    ? orderList.data.map((order) => ({
        restaurant_name: order.restaurant_name,
        employee_name: order.username,
        ordered_items: order.item_name,
        date: order.submitted_time,
      }))
    : [];

  return (
    <Stack
      direction="column"
      className="w-full"
    >
      <Stack
        className="my-8"
        justifyContent="space-between"
      >
        <Typography
          component="h4"
          className="text-2xl font-bold"
        >{`Order for ${watchedDate}`}</Typography>
        <Typography className="text-lg font-normal">{`Order user: ${orderList?.total}`}</Typography>
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
