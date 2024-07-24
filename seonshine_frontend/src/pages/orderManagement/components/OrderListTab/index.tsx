import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormatListBulletedOutlined, SummarizeOutlined } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

import DatePicker from '@/components/molecules/datePicker';
import Table from '@/components/organims/table';

import { dateFormat } from '@/constants/date';
import { useDeviceType } from '@/hooks/useDeviceType';
import useTable from '@/hooks/useTable';
import { OrderListType, ViewModeType } from '@/types/order';
import { RoleEnum } from '@/types/user';

import { useGetOrderListDetailApi, useGetOrderListSummaryApi } from '@/apis/hooks/orderListApi.hook';
import { BranchResponseType } from '@/apis/user';
import useAuthStore from '@/store/auth.store';

import { OrderListRestaurantTableHeader } from './OrderListRestaurantTableHeader';
import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 20;

const today = format(new Date(), dateFormat);

type OrderListTabPropsType = {
  orderDate?: string;
  branchId?: number;
  branchList: BranchResponseType[];
};

const OrderListTab = ({ orderDate, branchId, branchList }: OrderListTabPropsType) => {
  const { currentUser } = useAuthStore();
  const location = useLocation();
  const localState = location.state;
  const [viewMode, setViewMode] = useState<ViewModeType>(localState?.viewMode || 'summary');
  const isAdmin = currentUser?.role_id === RoleEnum.ADMIN;

  const { control, watch } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    values: { date: orderDate ? orderDate : today, branch_id: branchId || -1 },
  });

  const { isMobile } = useDeviceType();

  const { currentPage, handleSortingChange, sortKey, sortType } = useTable({
    initPageSize: ITEMS_PER_PAGE,
    initSortKey: 'item_name',
  });

  const watchedDate = watch('date');
  const watchedBranchId = watch('branch_id');

  const { data: orderListSummary, isFetching: isFetchingOrderListSummary } = useGetOrderListSummaryApi({
    params: { date: watchedDate, ...(watchedBranchId >= 0 && { branch_id: watchedBranchId }) },
    enabled: viewMode === 'summary',
  });

  const { data: orderListDetail, isFetching: isFetchingOrderListDetail } = useGetOrderListDetailApi({
    params: { date: watchedDate, ...(watchedBranchId >= 0 && { branch_id: watchedBranchId }) },
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
        branch_name: order.branch_name,
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
        flexWrap="wrap"
      >
        <Stack
          alignItems="center"
          gap={4}
          className="w-full sm:w-max md:w-3/5 lg:w-2/5 mx-auto sm:mx-0 mb-4"
        >
          <Box className="flex-1 w-1/2">
            <DatePicker<DateSchemaType>
              name="date"
              control={control}
            />
          </Box>
          <Box className="flex-1 w-1/2 sm:w-full">
            <Controller
              name="branch_id"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormControl fullWidth>
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
                        fontSize: '16px',
                        height: '16px !important',
                        minHeight: '16px !important',
                        lineHeight: '16px',
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
                    <MenuItem
                      key="all_branch"
                      value={-1}
                      className="text-lg"
                    >
                      All
                    </MenuItem>
                    {branchList.map((branch) => (
                      <MenuItem
                        key={branch.branch_id}
                        value={branch.branch_id}
                        className="text-lg"
                      >
                        {branch.branch_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <FormHelperText color="error">{error.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Box>
        </Stack>

        <Stack
          alignItems="flex-end"
          gap={4}
          className="ml-auto mb-4"
        >
          {viewMode === 'detail' && (
            <Typography className="text-lg font-normal">{`Order Users: ${orderListDetail?.total || 0}`}</Typography>
          )}
          {isAdmin && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={onChangeViewMode}
              aria-label="view mode"
              className="bg-white"
              sx={{
                maxHeight: '44px',
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
      </Stack>
      <Stack
        direction={isMobile ? 'column-reverse' : 'row'}
        gap={isMobile ? 4 : 8}
        alignItems="flex-start"
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
            className={`${isMobile ? 'w-full' : 'w-2/3 min-h-64'} bg-white py-6 px-8 rounded-md gap-2`}
            direction="column"
            justifyContent="space-evenly"
          >
            <Typography
              height={31}
              className="text-2xl font-bold"
            >
              Billing Information
            </Typography>
            <Typography className="text-xl flex items-center flex-wrap">
              Restaurant:&nbsp;
              <Typography
                component="span"
                className="text-xl font-bold whitespace-nowrap"
              >
                {orderListSummary?.restaurant_name || '...'}
              </Typography>
            </Typography>
            <Typography className="text-lg">{`Order Amount: ${orderListSummary?.total || 0}`}</Typography>
            <Typography className="text-lg">{`Branch: ${
              branchList.find((branch) => branch.branch_id === watchedBranchId)?.branch_name || 'All'
            }`}</Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default OrderListTab;
