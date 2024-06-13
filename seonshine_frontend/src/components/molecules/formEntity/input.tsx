import { InputHTMLAttributes } from 'react';
import { UseFormRegister } from 'react-hook-form';

import { Box, FormHelperText, InputAdornment } from '@mui/material';
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
  disabled?: boolean;
  variant?: TextFieldVariants;
  size?: OverridableStringUnion<'small' | 'medium', TextFieldPropsSizeOverrides>;
  className?: string;
  type?: InputHTMLAttributes<unknown>['type'];
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

const FormInput = ({
  error,
  name,
  placeholder,
  register,
  valueAsNumber,
  autoFocus,
  disabled,
  variant = 'filled',
  size = 'small',
  className = 'block',
  type = 'text',
  startAdornment,
  endAdornment,
}: TextFieldType) => {
  return (
    <Box>
      <TextField
        {...register(name, { valueAsNumber })}
        variant={variant}
        autoFocus={autoFocus}
        disabled={disabled}
        error={!!error}
        placeholder={placeholder}
        size={size}
        className={className}
        fullWidth
        type={type}
        sx={({ palette }) => ({
          '.MuiInputBase-root': {
            backgroundColor: palette.black[100],
          },
        })}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment
              position="start"
              sx={{ color: 'inherit' }}
            >
              <>{startAdornment}</>
            </InputAdornment>
          ) : undefined,
          endAdornment: endAdornment ? (
            <InputAdornment
              position="end"
              sx={{ color: 'inherit' }}
            >
              <>{endAdornment}</>
            </InputAdornment>
          ) : undefined,
        }}
      />
      <Box className="h-2">
        <FormHelperText
          error={!!error}
          sx={{
            marginTop: 1,
          }}
        >
          {error?.message}
        </FormHelperText>
      </Box>
    </Box>
  );
};

export default FormInput;
