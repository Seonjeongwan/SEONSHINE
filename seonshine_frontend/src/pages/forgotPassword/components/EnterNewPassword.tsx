import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';
import AccountVerificationLayout from '@/components/organims/accountVerification';

import { PasswordSchema, PasswordSchemaType } from '../schema';
import { EnterNewPasswordPropsType } from '../types';

const EnterNewPassword = ({ handleSubmitPassword }: EnterNewPasswordPropsType) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PasswordSchemaType>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const onSubmit = (data: PasswordSchemaType) => handleSubmitPassword(data.password);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  const handleShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <AccountVerificationLayout
      title="Reset Password"
      description="Change your password"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack
          direction="column"
          gap="24px"
          sx={{
            width: {
              xs: '320px',
              sm: '475px',
            },
            padding: '24px 0 0 0',
          }}
        >
          <Stack
            direction="column"
            gap={2}
          >
            <FormLabel
              title="New Password"
              required
            />
            <FormInput
              name="password"
              register={register}
              placeholder="Enter your new password"
              error={errors.password}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <IconButton
                  onMouseDown={handleShowPassword}
                  onMouseUp={handleShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              }
            />
          </Stack>
          <Stack
            direction="column"
            gap={2}
          >
            <FormLabel
              title="Confirm New Password"
              required
            />
            <FormInput
              name="confirmPassword"
              autoFocus
              register={register}
              placeholder="Confirm your new password"
              error={errors.confirmPassword}
              type={showConfirmPassword ? 'text' : 'password'}
              endAdornment={
                <IconButton
                  onMouseDown={handleShowConfirmPassword}
                  onMouseUp={handleShowConfirmPassword}
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              }
            />
          </Stack>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className="h-12"
          >
            <Typography variant="buttonM">Reset Password</Typography>
          </Button>
        </Stack>
      </form>
    </AccountVerificationLayout>
  );
};

export default EnterNewPassword;
