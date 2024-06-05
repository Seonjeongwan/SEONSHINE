import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Link, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import { useAuth } from '@/hooks/useAuth';

import { useLoginApi } from '@/apis/hooks/authApi.hook';
import { useLoadingStore } from '@/store/loading.store';

import loginBanner from '../../assets/images/login-banner.png';
import logo from '../../assets/images/Logo-Shinhan-Bank.webp';
import { LoginSchema, LoginSchemaType } from './schemas';

const LoginPage = () => {
  const {
    control,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      employeeId: '',
      password: '',
    },
  });

  const { mutate: exeLogin, isPending } = useLoginApi();
  const { login: handleLoginSuccess } = useAuth();

  const setLoading = useLoadingStore((state) => state.setLoading);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleClickShowPassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const handleLogin = (data: LoginSchemaType) => {
    exeLogin(data, {
      onSuccess: (data) => {
        setLoading(false);
        handleLoginSuccess(data, data.token, rememberMe);
      },
    });
  };

  const submitForm = (data: LoginSchemaType) => {
    handleLogin(data);
  };

  const rememberMeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  }, []);

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      className="w-screen h-screen bg-gray-100"
    >
      <Stack className="w-full h-full bg-white shadow-md lg:rounded-md shadow-gray-300 lg:w-194 lg:h-auto py-8">
        <Box className="grid w-full h-full grid-cols-1 lg:grid-cols-2">
          <Box className="hidden h-full lg:flex lg:items-center lg:justify-center">
            <img
              src={loginBanner}
              className="w-full"
            />
          </Box>
          <Stack
            justifyContent="center"
            alignItems="center"
            className="h-full px-8"
          >
            <form
              onSubmit={handleSubmit(submitForm)}
              className="w-full"
              noValidate
            >
              <Stack
                flexDirection="column"
                className="h-full"
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                >
                  <img
                    src={logo}
                    className="h-8 mt-3"
                  />
                </Stack>

                <h3 className="text-3xl font-bold mt-14 lg:mt-7">Login</h3>

                <Box className="grid gap-2 mt-4">
                  <Stack
                    direction="column"
                    className="gap-0.5"
                  >
                    <FormLabel
                      title="Employee ID"
                      required
                    />
                    <FormInput
                      name="employeeId"
                      autoFocus
                      register={register}
                      placeholder="Employee ID"
                      error={errors.employeeId}
                    />
                  </Stack>
                  <Stack
                    direction="column"
                    className="gap-0.5"
                  >
                    <FormLabel
                      title="Password"
                      required
                    />
                    <FormInput
                      name="password"
                      register={register}
                      placeholder="Password"
                      error={errors.password}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      }
                    />
                  </Stack>
                </Box>
                <Stack
                  marginTop={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        onChange={rememberMeHandler}
                      />
                    }
                    label="Remember me"
                    sx={{
                      '.MuiFormControlLabel-label': {
                        fontSize: '13px',
                      },
                    }}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-sm"
                  >
                    Forgot Password?
                  </Link>
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  className="mt-4 text-lg"
                  type="submit"
                  disabled={isPending}
                >
                  Login
                </Button>
                <hr className="w-full my-4" />
                <Stack>
                  <Typography
                    component="span"
                    className="text-sm"
                  >
                    No account yet?&nbsp;
                  </Typography>
                  <Link
                    href="/sign-up"
                    className="text-sm"
                  >
                    Sign Up
                  </Link>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
