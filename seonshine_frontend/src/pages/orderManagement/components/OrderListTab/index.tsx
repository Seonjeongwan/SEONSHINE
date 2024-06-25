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

import { OrderListTableHeader } from './OrderListTableHeader';
import { DateSchema, DateSchemaType } from './schema';

const ITEMS_PER_PAGE = 10;

const OrderListTab = () => {
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<DateSchemaType>({
    resolver: zodResolver(DateSchema),
    defaultValues: { date: '2024-06-24' },
  });

  const {
    currentPage,
    sortKey,
    sortType,
    pageSize,
    handlePageChange,
    handleSortingChange,
    searchField,
    searchQuery,
    handleSearchChange,
  } = useTable({ initPageSize: ITEMS_PER_PAGE, initSortKey: 'date' });

  const onSubmit = (data: DateSchemaType) => {};

  return (
    <Stack direction="column">
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
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const dateValue = value ? (typeof value === 'string' ? parseISO(value) : value) : null;

            return (
              <DatePicker
                value={dateValue}
                onChange={(date) => {
                  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
                  onChange(formattedDate);
                  handleSubmit(onSubmit)();
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
      <Typography
        variant="heading4"
        component="h3"
        className="my-8"
      >
        {`Order of ${getValues('date')}`}
      </Typography>
      <Table<OrderListType>
        // data={data?.data || []}
        data={[]}
        columns={OrderListTableHeader}
        isFetching={false}
        // pageCount={data ? Math.ceil(data.total / pageSize) : 0}
        onSortingChange={handleSortingChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageCount={0}
      />
    </Stack>
  );
};

export default OrderListTab;
