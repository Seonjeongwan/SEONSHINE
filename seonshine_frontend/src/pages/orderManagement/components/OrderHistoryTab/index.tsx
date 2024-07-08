import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';

import DatePicker from '@/components/molecules/datePicker';

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
      gap={6}
      sx={{ padding: '16px' }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        className="w-full lg:w-4/5 xl:w-3/5"
      >
        <Grid
          item
          xs={12}
          sm={1}
        >
          <Typography className="text-2xl font-bold">From</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={11}
          md={4}
        >
          <DatePicker<FromToDateSchemaType>
            control={control}
            name="fromDate"
            maxDate={watchedToDate}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={1}
        >
          <Typography className="text-2xl font-bold">To</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={4}
        >
          <DatePicker<FromToDateSchemaType>
            control={control}
            name="toDate"
            minDate={watchedFromDate}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={3}
          md={2}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSubmit(onClickSearch)}
            className="font-bold text-black-500 rounded-full bg-black-200 hover:bg-black-300 border-none hover:border-none w-full py-3 text-base max-w-36"
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <Stack
        direction="column"
        gap={4}
      >
        {OrderHistoryList &&
          OrderHistoryList.data.map((item) => (
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
