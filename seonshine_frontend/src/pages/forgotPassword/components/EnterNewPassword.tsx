import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, IconButton, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';
import AccountVerificationLayout from '@/components/organims/accountVerification/accountVerificationLayout';

import { paths } from '@/routes/paths';

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

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleToggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <AccountVerificationLayout
      title="Reset Password"
      description="Change your password"
    >
      <Link
        to={paths.login}
        className="text-blue-400 !underline absolute top-2 left-3 font-medium"
      >
        {'< Back to Login'}
      </Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Stack
          direction="column"
          gap={6}
          sx={{
            width: {
              xs: '320px',
              sm: '475px',
            },
          }}
          className="p-0 pt-6"
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
                  onPointerUp={handleTogglePassword}
                  onPointerDown={handleTogglePassword}
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
                  onMouseDown={handleToggleConfirmPassword}
                  onMouseUp={handleToggleConfirmPassword}
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
