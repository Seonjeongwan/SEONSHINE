import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, Link, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';
import AccountVerificationLayout from '@/components/organims/accountVerification/accountVerificationLayout';
import ConfirmModal from '@/components/organims/confirmModal';

import loginBanner from '@/assets/images/login-banner.png';
import logo from '@/assets/images/logo.png';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';
import { IErrorResponse } from '@/types/common';
import { CurrentUserType, UserStatusEnum } from '@/types/user';
import { clearAccessToken, setAccessToken } from '@/utils/persistCache/token';

import { useLoginApi } from '@/apis/hooks/authApi.hook';
import { useChangeStatusApi } from '@/apis/hooks/userApi.hook';
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
  const [isClose, setIsClose] = useState<boolean>(false);
  const [userLogin, setUserLogin] = useState<CurrentUserType | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const { mutate: exeLogin, isPending } = useLoginApi();
  const { login: handleLoginSuccess } = useAuth();

  const { mutate: changeStatus } = useChangeStatusApi();

  const setLoading = useLoadingStore((state) => state.setLoading);

  const [showPassword, setShowPassword] = useState<boolean>(false);

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

        if (Number(user_status) === UserStatusEnum.CLOSE) {
          setIsClose(true);
          setUserLogin(user);
          return;
        }

        if (Number(user_status) === UserStatusEnum.DEACTIVATED) {
          toast.warning(message);
        }

        if (user) {
          handleLoginSuccess(user, user?.token as string);
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

  const handleActivate = () => {
    setAccessToken(userLogin?.token as string);
    changeStatus(
      {
        user_id: userLogin?.user_id as string,
        status: UserStatusEnum.ACTIVE,
      },
      {
        onSuccess: () => {
          toast.success('The account has been successfully activated.');
          handleLoginSuccess(userLogin!, userLogin?.token as string);
          navigate(paths.index);
        },
        onError: () => {
          toast.error('Activate failed');
          clearAccessToken();
        },
      },
    );
  };

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      className="w-full h-screen max-h-dvh"
    >
      {isWaiting ? (
        <PendingApprovalPage
          className="items-center"
          handleGotoLogin={() => setIsWaiting(false)}
        />
      ) : isClose ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          className="h-full w-full"
        >
          <ConfirmModal
            open={isConfirmModalOpen}
            title="Active Confirmation"
            description="Are you sure you want to activate this account?"
            handleClose={() => setIsConfirmModalOpen(false)}
            handleConfirm={handleActivate}
          />
          <Stack
            direction="column"
            justifyContent="center"
            gap={8}
            alignItems="center"
            className="w-full md:w-max h-full md:h-fit bg-white p-4 sm:p-20 rounded-md"
          >
            <Typography
              component="h2"
              className="text-center uppercase text-2xl sm:text-4xl font-extrabold"
            >
              You've deactivated your account
            </Typography>
            <Typography className="text-center text-lg sm:text-xl">
              Please Activate your account to use the service.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsConfirmModalOpen(true)}
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginTop: '56px',
                paddingInline: '32px',
                paddingBlock: '6px',
                minWidth: 'min-content',
                maxWidth: 'max-content',
                borderRadius: '32px',
                boxShadow: 'none',
              }}
            >
              Activate
            </Button>
          </Stack>
        </Stack>
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
                      className="flex md:hidden"
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
                      className="text-center tracking-wider mr-4 md:m-auto"
                      sx={(theme) => ({
                        [theme.breakpoints.down(400)]: {
                          fontSize: '40px',
                        },
                        fontSize: {
                          xs: '48px',
                          md: '64px',
                        },
                      })}
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
                    marginTop={4}
                    justifyContent="flex-end"
                    alignItems="center"
                  >
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
