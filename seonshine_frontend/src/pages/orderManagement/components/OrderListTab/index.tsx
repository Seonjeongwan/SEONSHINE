import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isValid, parseISO } from 'date-fns';

import Table from '@/components/organims/table';

import useTable from '@/hooks/useTable';
import { OrderListType } from '@/types/order';
import { RoleEnum } from '@/types/user';

import { useGetOrderListByDateApi } from '@/apis/hooks/orderListApi.hook';
import useAuthStore from '@/store/auth.store';

import { OrderListRestaurantTableHeader } from './OrderListRestaurantTableHeader';
import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 10;

const today = format(new Date(), 'yyyy-MM-dd');

const OrderListTab = () => {
  const { currentUser } = useAuthStore();

  const restaurantId = currentUser?.role_id === RoleEnum.RESTAURANT ? currentUser.user_id : '';

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

  const { data: orderList, isFetching } = useGetOrderListByDateApi({
    date: watchedDate,
    restaurant_id: 'shinhanuser10',
    page_size: pageSize,
    page_number: currentPage,
    sort_key: sortKey,
    sort_type: sortType,
  });

  const columns = !!restaurantId ? OrderListRestaurantTableHeader : OrderListTableHeader;

  const data: OrderListType[] = orderList
    ? orderList.data.map((order) => ({
        ordered_items: order.item_name,
        amount: order.quantity,
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
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Controller
          name={'date'}
          control={control}
          rules={{
            validate: (value) => {
              if (!value) return 'Date is required';

              const parsedDate = parseISO(value);
              if (!isValid(parsedDate)) return 'Invalid date';

              const [year, month, day] = value.split('-');
              if (parseInt(day, 10) < 1 || parseInt(day, 10) > 31) return 'Invalid day';
              if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) return 'Invalid month';
              if (parseInt(year, 10) < 1900 || parseInt(year, 10) > new Date().getFullYear()) return 'Invalid year';

              return true;
            },
          }}
          render={({ field: { onChange, value } }) => {
            const dateValue = value ? (typeof value === 'string' ? parseISO(value) : value) : null;

            return (
              <DatePicker
                value={dateValue}
                onChange={(date) => {
                  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                  onChange(formattedDate);
                }}
                format="yyyy-MM-dd"
                sx={(theme) => ({
                  '.MuiInputBase-root': {
                    paddingRight: '24px',
                  },
                  '.MuiInputBase-input': {
                    textAlign: 'center',
                    fontWeight: theme.typography.fontWeightBold,
                    fontSize: '20px',
                    lineHeight: '24px',
                    height: '18px',
                    paddingBottom: '15px',
                    color: theme.palette.black[300],
                  },
                  fieldset: {
                    border: 'none',
                  },
                })}
                className="bg-white max-w-96 rounded-full"
              />
            );
          }}
        />
        {errors.date && <Typography color="error">{errors.date.message}</Typography>}
      </LocalizationProvider>

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
        onPageChange={handlePageChange}
      />
    </Stack>
  );
};

export default OrderListTab;
