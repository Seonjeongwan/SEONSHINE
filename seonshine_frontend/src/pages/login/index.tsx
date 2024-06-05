import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, Link, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';
import { login } from '@/apis/auth';
import loginBanner from '../../assets/images/login-banner.png';
import logo from '../../assets/images/Logo-Shinhan-Bank.webp';
import { LoginSchema, LoginSchemaType } from './schemas';
import { useLoginApi } from '@/apis/hooks/authApi.hook';

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

  console.log('errors', errors);

  const { mutate: login, isPending } = useLoginApi();

  const submitForm = (data: LoginSchemaType) => {
    login(data);
  };

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
                      type="password"
                    />
                  </Stack>
                </Box>
                <Stack
                  marginTop={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    label="Remember me"
                    sx={{
                      '.MuiFormControlLabel-label': {
                        fontSize: '13px',
                      },
                    }}
                  />
                  <Link
                    href="#"
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
                <Link
                  href="#"
                  className="text-sm"
                >
                  No account yet? Sign Up
                </Link>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default LoginPage;
