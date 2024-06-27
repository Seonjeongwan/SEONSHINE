import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

import DatePicker from '@/components/molecules/datePicker';
import Table from '@/components/organims/table';

import { dateFormat } from '@/constants/date';
import useTable from '@/hooks/useTable';
import { OrderListType } from '@/types/order';
import { RoleEnum } from '@/types/user';

import { useGetOrderListSumaryApi } from '@/apis/hooks/orderListApi.hook';
import useAuthStore from '@/store/auth.store';

import { OrderListRestaurantTableHeader } from './OrderListRestaurantTableHeader';
import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 20;

const today = format(new Date(), dateFormat);

const OrderListTab = () => {
  const { currentUser } = useAuthStore();

  const restaurantId = currentUser?.role_id === RoleEnum.RESTAURANT ? currentUser.user_id : '';

  const { control, watch } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: today },
  });

  const { currentPage, handleSortingChange } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });

  const watchedDate = watch('date');

  const { data: orderList, isFetching } = useGetOrderListSumaryApi({
    date: watchedDate,
  });

  const columns = !!restaurantId ? OrderListRestaurantTableHeader : OrderListTableHeader;

  const data: OrderListType[] = orderList
    ? orderList.data.map((order) => ({
        ordered_items: order.item_name,
        amount: order.count,
      }))
    : [];

  return (
    <Stack
      direction="column"
      className="w-full lg:w-240"
    >
      {!!restaurantId && (
        <Typography
          variant="heading4"
          component="h3"
          className="mb-8 text-3xl font-bold"
        >
          {currentUser?.username}
        </Typography>
      )}
      <DatePicker<DateSchemaType>
        name="date"
        control={control}
      />

      <Stack
        className="my-8"
        justifyContent="space-between"
      >
        <Typography
          component="h4"
          className="text-2xl font-bold"
        >{`Order of ${watchedDate}`}</Typography>
        <Typography className="text-lg font-normal">{`Order amount: ${orderList?.total}`}</Typography>
      </Stack>

      <Table<OrderListType>
        data={data}
        columns={columns}
        isFetching={isFetching}
        onSortingChange={handleSortingChange}
        currentPage={currentPage}
      />
    </Stack>
  );
};

export default OrderListTab;
