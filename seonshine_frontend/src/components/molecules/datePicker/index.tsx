import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import { Box, FormHelperText } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker as XDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isValid, parseISO } from 'date-fns';

import { dateFormat } from '@/constants/date';

type DatePickerPropsType<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  disabled?: boolean;
  varirant?: 'normal' | 'small';
  minDate?: string;
  maxDate?: string;
};

const DatePicker = <T extends FieldValues>({
  name,
  control,
  disabled,
  varirant = 'normal',
  minDate,
  maxDate,
}: DatePickerPropsType<T>) => {
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
              <XDatePicker
                value={dateValue}
                onChange={(date) => {
                  const formattedDate = date ? format(date, dateFormat) : '';
                  onChange(formattedDate);
                }}
                format={dateFormat}
                minDate={minDate ? parseISO(minDate) : undefined}
                maxDate={maxDate ? parseISO(maxDate) : undefined}
                disabled={disabled}
                sx={(theme) => {
                  return varirant === 'normal'
                    ? {
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
                      }
                    : {
                        width: '100%',
                        '.MuiInputBase-root': {
                          borderBottomWidth: '2px',
                        },
                        '.MuiInputBase-input': {
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: theme.typography.fontWeightRegular,
                          lineHeight: '24px',
                          height: '18px',
                          paddingLeft: '0',
                          paddingBlock: '0 !important',
                        },
                        fieldset: {
                          border: 'none',
                        },
                      };
                }}
                className="bg-white max-w-96 rounded-full"
              />
              {error && <FormHelperText color="error">{error.message}</FormHelperText>}
            </Box>
          );
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
