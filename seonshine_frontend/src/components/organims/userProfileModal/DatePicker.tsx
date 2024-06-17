import React from 'react';

interface DatePickerProps {
  name: string;
  control: any; // Replace with proper type for control from react-hook-form
  disabled?: boolean;
}

const DateTimePicker: React.FC<DatePickerProps> = ({ name, control, disabled = false }) => {
  return <div></div>;
};

export default DateTimePicker;
