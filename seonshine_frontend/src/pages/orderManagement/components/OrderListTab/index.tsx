import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormatListBulletedOutlined, SummarizeOutlined } from '@mui/icons-material';
import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { format } from 'date-fns';

import DatePicker from '@/components/molecules/datePicker';
import Table from '@/components/organims/table';

import { dateFormat } from '@/constants/date';
import useTable from '@/hooks/useTable';
import { OrderListType, ViewModeType } from '@/types/order';
import { RoleEnum } from '@/types/user';

import { useGetOrderListDetailApi, useGetOrderListSummaryApi } from '@/apis/hooks/orderListApi.hook';
import useAuthStore from '@/store/auth.store';

import { OrderListRestaurantTableHeader } from './OrderListRestaurantTableHeader';
import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 20;

const today = format(new Date(), dateFormat);

type OrderListTabPropsType = {
  orderDate?: string;
};

const OrderListTab = ({ orderDate }: OrderListTabPropsType) => {
  const [viewMode, setViewMode] = useState<ViewModeType>('summary');

  const { currentUser } = useAuthStore();

  const isAdmin = currentUser?.role_id === RoleEnum.ADMIN;

  const { control, watch } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: orderDate ? orderDate : today },
  });

  const { currentPage, handleSortingChange, sortKey, sortType } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });

  const watchedDate = watch('date');

  const { data: orderListSummary, isFetching: isFetchingOrderListSummary } = useGetOrderListSummaryApi({
    params: { date: watchedDate },
    enabled: viewMode === 'summary',
  });

  const { data: orderListDetail, isFetching: isFetchingOrderListDetail } = useGetOrderListDetailApi({
    params: { date: watchedDate },
    enabled: viewMode === 'detail',
  });

  const columns = viewMode === 'summary' ? OrderListRestaurantTableHeader : OrderListTableHeader;

  const getOrderSummaryData = () => {
    return (
      orderListSummary?.data.map((order) => ({
        ordered_items: order.item_name,
        amount: order.count,
      })) || []
    );
  };

  const getOrderDetailData = () => {
    return (
      orderListDetail?.data.map((order) => ({
        restaurant_name: order.restaurant_name,
        employee_name: order.username,
        ordered_items: order.item_name,
        date: order.submitted_time,
      })) || []
    );
  };

  const sortData = (data: OrderListType[]) => {
    return data.sort((a, b) => {
      const aValue = a[sortKey as keyof OrderListType];
      const bValue = b[sortKey as keyof OrderListType];

      if (aValue === undefined || bValue === undefined) {
        return 0;
      }

      if (aValue < bValue) {
        return sortType === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortType === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  };

  const data: OrderListType[] = useMemo(() => {
    const data: OrderListType[] = viewMode === 'summary' ? getOrderSummaryData() : getOrderDetailData();
    return sortData(data);
  }, [viewMode, orderListSummary, orderListDetail, sortKey, sortType]);

  const onChangeViewMode = (event: React.MouseEvent<HTMLElement>, newAlignment: ViewModeType) => {
    setViewMode(newAlignment);
  };

  return (
    <Stack
      direction="column"
      className="w-full lg:w-240"
    >
      <Stack
        justifyContent="space-between"
        gap={4}
      >
        <DatePicker<DateSchemaType>
          name="date"
          control={control}
        />
        {isAdmin && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={onChangeViewMode}
            aria-label="view mode"
            className="bg-white"
          >
            <ToggleButton
              value="summary"
              aria-label="summary mode"
              className="border-none"
            >
              <SummarizeOutlined />
            </ToggleButton>
            <ToggleButton
              value="detail"
              aria-label="detail mode"
              className="border-none"
            >
              <FormatListBulletedOutlined />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>
      {viewMode === 'summary' && (
        <Typography
          variant="heading4"
          component="h3"
          className="mt-8 text-3xl font-bold"
        >
          {orderListSummary?.restaurant_name}
        </Typography>
      )}
      <Stack
        className="my-8"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="h4"
          className="text-2xl font-bold"
        >{`Order of ${watchedDate}`}</Typography>
        <Typography className="text-lg font-normal">
          {viewMode === 'summary'
            ? `Order amount: ${orderListSummary?.total}`
            : `Order Users: ${orderListDetail?.total}`}
        </Typography>
      </Stack>

      <Table<OrderListType>
        data={data}
        columns={columns}
        isFetching={isFetchingOrderListSummary || isFetchingOrderListDetail}
        onSortingChange={handleSortingChange}
        currentPage={currentPage}
      />
    </Stack>
  );
};

export default OrderListTab;
