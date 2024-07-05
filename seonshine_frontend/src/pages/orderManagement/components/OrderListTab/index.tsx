import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormatListBulletedOutlined, SummarizeOutlined } from '@mui/icons-material';
import { Box, Grid, MenuItem, Select, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { format } from 'date-fns';

import DatePicker from '@/components/molecules/datePicker';
import Table from '@/components/organims/table';

import { dateFormat } from '@/constants/date';
import { useDeviceType } from '@/hooks/useDeviceType';
import useTable from '@/hooks/useTable';
import { OrderListType, ViewModeType } from '@/types/order';
import { RoleEnum } from '@/types/user';

import { useGetOrderListDetailApi, useGetOrderListSummaryApi } from '@/apis/hooks/orderListApi.hook';
import { useGetBranches } from '@/apis/hooks/userApi.hook';
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
  const { currentUser } = useAuthStore();
  const location = useLocation();
  const localState = location.state;
  const [viewMode, setViewMode] = useState<ViewModeType>(localState?.viewMode || 'summary');
  const isAdmin = currentUser?.role_id === RoleEnum.ADMIN;

  const { control, watch } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: orderDate ? orderDate : today, branch_id: 1 },
  });

  const { isMobile } = useDeviceType();

  const { currentPage, handleSortingChange, sortKey, sortType } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });

  const watchedDate = watch('date');
  const watchedBranchId = watch('branch_id');

  const { data: orderListSummary, isFetching: isFetchingOrderListSummary } = useGetOrderListSummaryApi({
    params: { date: watchedDate, branch_id: watchedBranchId },
    enabled: viewMode === 'summary',
  });

  const { data: orderListDetail, isFetching: isFetchingOrderListDetail } = useGetOrderListDetailApi({
    params: { date: watchedDate, branch_id: watchedBranchId },
    enabled: viewMode === 'detail',
  });

  const { data: branchData = [] } = useGetBranches({ enabled: true });

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

  const onChangeViewMode = (event: React.MouseEvent<HTMLElement>, newViewMode: ViewModeType) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <Stack
      direction="column"
      className="w-full"
    >
      <Stack
        justifyContent="space-between"
        gap={4}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          className="max-w-fit"
        >
          <Grid
            item
            xs={12}
            sm={6}
          >
            <DatePicker<DateSchemaType>
              name="date"
              control={control}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            className="w-full"
          >
            <Controller
              name="branch_id"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <Select
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  value={value}
                  onChange={onChange}
                  size="small"
                  sx={(theme) => ({
                    '.MuiInputBase-root': {
                      paddingRight: '24px',
                    },
                    '.MuiSelect-select': {
                      textAlign: 'center',
                      fontWeight: theme.typography.fontWeightBold,
                      fontSize: '20px',
                      height: '18px',
                      minHeight: '18px !important',
                      paddingLeft: '32px',
                      paddingBottom: '14px',
                      color: theme.palette.black[300],
                    },
                    fieldset: {
                      border: 'none',
                    },
                  })}
                  className="bg-white w-full max-w-80 rounded-full"
                >
                  {branchData.map((branch) => (
                    <MenuItem
                      key={branch.branch_id}
                      value={branch.branch_id}
                      className="text-xl"
                    >
                      {branch.branch_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </Grid>
        </Grid>

        {isAdmin && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={onChangeViewMode}
            aria-label="view mode"
            className="bg-white"
            sx={{
              maxHeight: '46px',
            }}
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
      <Stack
        className="my-4"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          component="h4"
          className="text-2xl font-bold"
        >{`Order of ${watchedDate}`}</Typography>
        {viewMode === 'detail' && (
          <Typography className="text-lg font-normal">{`Order Users: ${orderListDetail?.total}`}</Typography>
        )}
      </Stack>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        gap={8}
      >
        <Table<OrderListType>
          data={data}
          columns={columns}
          isFetching={isFetchingOrderListSummary || isFetchingOrderListDetail}
          onSortingChange={handleSortingChange}
          currentPage={currentPage}
        />
        {viewMode === 'summary' && (
          <Stack
            className={`${isMobile ? 'w-full' : 'w-2/3'} bg-white py-4 px-8 rounded-md gap-2`}
            direction="column"
          >
            <Typography className="text-3xl font-bold">Billing Information</Typography>
            <Typography className="text-2xl flex items-center flex-wrap">
              Restaurant:&nbsp;
              <Typography className="text-2xl font-bold whitespace-nowrap">
                {orderListSummary?.restaurant_name}
              </Typography>
            </Typography>
            <Typography className="text-lg">{`Order Amount: ${orderListSummary?.total}`}</Typography>
            <Typography className="text-lg">{`Branch: ${orderListSummary?.total}`}</Typography>
            <Typography className="text-lg">{`Address: ${orderListSummary?.total}`}</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default OrderListTab;
