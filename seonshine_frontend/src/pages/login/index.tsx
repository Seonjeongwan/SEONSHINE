import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Link, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import loginBanner from '@/assets/images/login-banner.png';
import logo from '@/assets/images/logo.png';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';
import { IErrorResponse } from '@/types/common';
import { UserStatusEnum } from '@/types/user';

import { useLoginApi } from '@/apis/hooks/authApi.hook';
import { useLoadingStore } from '@/store/loading.store';

import PendingApprovalPage from '../signUp/components/PendingApproval';
import { LoginSchema, LoginSchemaType } from './schemas';

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      employeeId: '',
      password: '',
    },
  });
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const navigate = useNavigate();

  const { mutate: exeLogin, isPending } = useLoginApi();
  const { login: handleLoginSuccess } = useAuth();

  const setLoading = useLoadingStore((state) => state.setLoading);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const rememberCheckboxRef = useRef<HTMLInputElement>(null);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = (data: LoginSchemaType) => {
    exeLogin(data, {
      onSuccess: (data) => {
        setLoading(false);
        if (!data) return;

        const { user_status, user, message } = data;

        if (Number(user_status) === UserStatusEnum.WAITING_CONFIRM) {
          setIsWaiting(true);
        }

        if (Number(user_status) === UserStatusEnum.DEACTIVATED || Number(user_status) === UserStatusEnum.CLOSE) {
          toast.warning(message);
        }

        if (user) {
          handleLoginSuccess(user, user.token, !!rememberCheckboxRef.current?.checked);
          navigate(paths.index);
        }
      },
      onError: (err: IErrorResponse) => {
        toast.error(err.response.data.message);
      },
    });
  };

  const submitForm = (data: LoginSchemaType) => {
    handleLogin(data);
  };

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      className="w-full h-screen"
    >
      {isWaiting ? (
        <PendingApprovalPage
          className="items-center"
          handleGotoLogin={() => setIsWaiting(false)}
        />
      ) : (
        <Stack className="w-full h-full bg-white shadow-md md:rounded-2xl shadow-black-100 md:w-280 md:h-176">
          <Box className="grid w-full h-full grid-cols-1 md:grid-cols-2">
            <Box className="hidden h-full md:flex md:items-center md:justify-center bg-gradient-to-br from-blue-500 to-yellow-500 opacity-90 z-0 rounded-es-2xl rounded-ss-2xl">
              <img
                src={loginBanner}
                className="w-full z-10"
                alt="Login banner"
              />
            </Box>
            <Stack
              justifyContent="center"
              alignItems="center"
              className="h-full px-8 py-8"
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
                    justifyContent="center"
                    alignItems="center"
                    className="mb-16"
                  >
                    <Box
                      className="hidden xs:block md:hidden"
                      sx={{
                        width: {
                          xs: '80px',
                          md: '120px',
                        },
                        height: {
                          xs: '80px',
                          md: '120px',
                        },
                      }}
                    >
                      <img
                        src={logo}
                        alt="Logo"
                        className="object-cover"
                      />
                    </Box>
                    <Typography
                      variant="heading1"
                      component="h1"
                      className="text-center tracking-wider"
                      sx={{
                        fontSize: {
                          xs: '48px',
                          md: '64px',
                        },
                      }}
                    >
                      Seonshine
                    </Typography>
                  </Stack>

                  <Box className="grid gap-4 mt-4">
                    <Stack
                      direction="column"
                      className="gap-2"
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
                      className="gap-2"
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
                          <IconButton
                            onPointerUp={handleTogglePassword}
                            onPointerDown={handleTogglePassword}
                          >
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
                          inputRef={rememberCheckboxRef}
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
                      href={paths.forgotPassword}
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
                      fontSize="13px"
                    >
                      No account yet?&nbsp;
                    </Typography>
                    <Link
                      href={paths.signUp}
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
      )}
    </Stack>
  );
};

export default LoginPage;
