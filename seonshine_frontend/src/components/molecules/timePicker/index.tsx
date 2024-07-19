import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';

import { FormHelperText, Stack } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker as XTimePicker } from '@mui/x-date-pickers/TimePicker';

const formatTime = (date: Date | null): string => {
  if (!date) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const parseTime = (time: string): Date | null => {
  if (!time) return null;
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date;
};

type TimePickerProps = {
  name: string;
  control: Control<any>;
};

const TimePicker = ({ name, control }: TimePickerProps) => {
  const [tempValue, setTempValue] = useState<Date | null>(null);

  const handleOpen = (fieldValue: string) => {
    setTempValue(parseTime(fieldValue));
  };

  const handleClose = () => {
    setTempValue(null);
  };

  const handleAccept = (date: Date | null, onChange: (value: string) => void) => {
    onChange(formatTime(date));
    setTempValue(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Stack
            direction="column"
            justifyContent="center"
            className="relative"
          >
            <XTimePicker
              {...field}
              ampm={false}
              value={tempValue !== null ? tempValue : parseTime(field.value)}
              onOpen={() => handleOpen(field.value)}
              onAccept={(date) => handleAccept(date, field.onChange)}
              onClose={handleClose}
              onChange={(newValue) => setTempValue(newValue)}
              sx={(theme) => ({
                '.MuiInputBase-root': {
                  borderRadius: '10px',
                  maxWidth: '180px',
                  height: '40px',
                  '.MuiInputBase-input': {
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: theme.typography.fontWeightBold,
                  },
                },
                fieldset: {
                  borderColor: error ? theme.palette.error.main : undefined,
                },
              })}
            />
            {error && (
              <FormHelperText
                color="error"
                className="absolute top-full left-0"
              >
                {error.message}
              </FormHelperText>
            )}
          </Stack>
        )}
      />
    </LocalizationProvider>
  );
};

export default TimePicker;
