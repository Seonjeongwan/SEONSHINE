import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Link, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import { login } from '@/api/auth';

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

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleClickShowPassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const mutation = useMutation({
    mutationFn: async (data: LoginSchemaType) => {
      return login(data.employeeId, data.password);
    },
    onSuccess: (data) => {
      console.log('Login successful', data);
      if (rememberMe) {
        localStorage.setItem('token', data.token);
      } else {
        sessionStorage.setItem('token', data.token);
      }
      navigate('/');
    },
    onError: (error) => {
      console.error('Login failed', error);
    },
  });

  const submitForm = (data: LoginSchemaType) => {
    mutation.mutate(data);
  };

  const rememberMeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  }, []);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      className="w-screen h-screen bg-gray-100"
    >
      <Stack className="w-full h-full bg-white shadow-md lg:rounded-md shadow-gray-300 lg:w-194 lg:h-120">
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

                <h3 className="text-2xl font-bold mt-14 lg:mt-7">Login</h3>

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
                  disabled={mutation.isPending}
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
            {mutation.isError && <div className="text-red-500">Login failed. Please try again.</div>}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
