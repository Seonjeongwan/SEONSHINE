import { UseFormRegister } from 'react-hook-form';

import TextField, { TextFieldPropsSizeOverrides, TextFieldVariants } from '@mui/material/TextField';
import { OverridableStringUnion } from '@mui/types';

import { IPlainObject } from '@/types/common';

type TextFieldType = {
  placeholder?: string;
  name: string;
  register: UseFormRegister<any>;
  error?: IPlainObject;
  valueAsNumber?: boolean;
  autoFocus?: boolean;
  variant?: TextFieldVariants;
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>;
  className?: string;
};

const FormInput = ({
  error,
  name,
  placeholder,
  register,
  valueAsNumber,
  autoFocus,
  variant = 'filled',
  size = 'small',
  className = 'block',
}: TextFieldType) => {
  return (
    <TextField
      {...register(name, { valueAsNumber })}
      variant={variant}
      autoFocus={autoFocus}
      error={!!error}
      helperText={error?.message}
      placeholder={placeholder}
      size={size}
      className="block"
      fullWidth
    />
  );
};

export default FormInput;
