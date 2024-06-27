import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isValid, parseISO } from 'date-fns';

import DatePickerMUI from '../DatePickerMUI';
import OrderHistoryItem from './OrderHistoryItem';
import { FromToDateSchema, FromToDateSchemaType } from './schema';

const today = format(new Date(), 'yyyy-MM-dd');

const OrderHistoryTab = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FromToDateSchemaType>({
    resolver: zodResolver(FromToDateSchema),
    defaultValues: { fromDate: today, toDate: today },
  });

  const onClickSearch = (data: FromToDateSchemaType) => {
    console.log({ data });
  };
  return (
    <Stack
      direction="column"
      gap={6}
    >
      <Stack
        alignItems="center"
        gap={8}
      >
        <Typography className="text-2xl font-bold">From</Typography>
        <DatePickerMUI<FromToDateSchemaType>
          control={control}
          name="fromDate"
        />

        <Typography className="text-2xl font-bold">To</Typography>
        <DatePickerMUI<FromToDateSchemaType>
          control={control}
          name="toDate"
        />
        <Box className="w-1/4 md:w-1/6 lg:w-1/12 h-full">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSubmit(onClickSearch)}
            className="font-bold text-black-500 rounded-full bg-black-200 hover:bg-black-300 border-none hover:border-none h-full w-full text-base"
          >
            Search
          </Button>
        </Box>
      </Stack>
      <OrderHistoryItem />
      <OrderHistoryItem />
    </Stack>
  );
};

export default OrderHistoryTab;
