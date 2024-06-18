import React, { useRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Control, Controller, useFormState } from 'react-hook-form';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { format, isValid, parse } from 'date-fns';

interface DatePickerProps {
  name: string;
  control: Control<any>;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ name, control, disabled = false }) => {
  const datePickerRef = useRef<any>(null);
  const { errors } = useFormState({ control });

  const handleIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) => {
          if (!value) return 'Date is required';

          const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
          if (!isValid(parsedDate)) return 'Invalid date';

          const [day, month, year] = value.split('/');
          if (parseInt(day, 10) < 1 || parseInt(day, 10) > 31) return 'Invalid day';
          if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) return 'Invalid month';
          if (parseInt(year, 10) < 1900 || parseInt(year, 10) > new Date().getFullYear()) return 'Invalid year';

          return true;
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const dateValue = value
          ? typeof value === 'string'
            ? parse(value, 'dd/MM/yyyy', new Date())
            : new Date(value)
          : null;

        return (
          <div className="flex items-center">
            <ReactDatePicker
              ref={datePickerRef}
              selected={dateValue && isValid(dateValue) ? dateValue : null}
              onChange={(date) => onChange(date ? format(date, 'dd/MM/yyyy') : '')}
              disabled={disabled}
              className={`bg-white w-full outline-none border-b-2 border-black ${
                error ? 'border-red-500' : 'border-black'
              }`}
              placeholderText="Select date"
              dateFormat="dd/MM/yyyy"
            />
            <CalendarMonthIcon
              className="ml-2 text-gray-600 cursor-pointer"
              onClick={handleIconClick}
            />
            {error && <p className="text-red-500 text-xs">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default DatePicker;
