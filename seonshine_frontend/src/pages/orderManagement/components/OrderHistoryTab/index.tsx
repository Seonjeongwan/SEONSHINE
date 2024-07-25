import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { HorizontalRule } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import DatePicker from '@/components/molecules/datePicker';

import { useDeviceType } from '@/hooks/useDeviceType';

import { useGetOrderListHistoryApi } from '@/apis/hooks/orderListApi.hook';

import OrderHistoryItem from './OrderHistoryItem';
import { FromToDateSchema, FromToDateSchemaType } from './schema';

const today = format(new Date(), 'yyyy-MM-dd');
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

type OrderHistoryTabPropsStyle = {
  handleViewDetail: (orderDate: string, branchId: number) => void;
};

const OrderHistoryTab = ({ handleViewDetail }: OrderHistoryTabPropsStyle) => {
  const { control, handleSubmit, watch } = useForm<FromToDateSchemaType>({
    resolver: zodResolver(FromToDateSchema),
    defaultValues: { fromDate: yesterday, toDate: today },
  });

  const queryClient = useQueryClient();

  const { isMobile } = useDeviceType();

  const watchedFromDate = watch('fromDate');
  const watchedToDate = watch('toDate');

  const { data: OrderHistoryList } = useGetOrderListHistoryApi({
    from: watchedFromDate,
    to: watchedToDate,
  });

  const onClickSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['getOrderListHistory'] });
  };

  return (
    <Stack
      direction="column"
      gap={4}
    >
      <Stack
        gap={4}
        direction={isMobile ? 'column' : 'row'}
        className="w-full lg:w-3/5"
      >
        <Stack gap={4}>
          <Stack
            alignItems="center"
            gap={4}
            justifyContent="space-between"
            className="flex-1"
          >
            {!isMobile && <Typography className="text-2xl font-bold min-w-14">From</Typography>}
            <Box className="self-end">
              <DatePicker<FromToDateSchemaType>
                control={control}
                name="fromDate"
                maxDate={watchedToDate}
              />
            </Box>
          </Stack>
          {isMobile && (
            <HorizontalRule
              fontSize="medium"
              className="self-center"
            />
          )}
          <Stack
            justifyContent="space-between"
            alignItems="center"
            gap={4}
            className="flex-1"
          >
            {!isMobile && (
              <Typography className={`text-2xl font-bold min-w-14 ${isMobile ? 'text-left' : 'text-right'}`}>
                To
              </Typography>
            )}
            <Box className="self-end">
              <DatePicker<FromToDateSchemaType>
                control={control}
                name="toDate"
                minDate={watchedFromDate}
              />
            </Box>
          </Stack>
        </Stack>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleSubmit(onClickSearch)}
          sx={{
            maxHeight: '44px',
          }}
          className="self-end font-bold text-black-500 rounded-full bg-black-200 hover:bg-black-300 border-none hover:border-none w-full py-3 text-base max-w-32"
        >
          Search
        </Button>
      </Stack>
      <Stack
        direction="column"
        gap={4}
      >
        {OrderHistoryList &&
          [...OrderHistoryList.data].reverse().map((item) => (
            <OrderHistoryItem
              key={item.order_id}
              item={item}
              handleViewDetail={handleViewDetail}
            />
          ))}
      </Stack>
    </Stack>
  );
};

export default OrderHistoryTab;
