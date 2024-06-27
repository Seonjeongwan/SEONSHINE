import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form';

import { Box, Stack, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isValid, parseISO } from 'date-fns';

type DatePickerMUIPropsType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
};

const DatePickerMUI = <T extends FieldValues>({ name, control }: DatePickerMUIPropsType<T>) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
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
            <Box>
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
              {error && <Typography color="error">{error.message}</Typography>}
            </Box>
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerMUI;
