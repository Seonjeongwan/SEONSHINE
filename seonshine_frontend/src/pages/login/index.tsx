import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, Link, Stack, TextField } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import loginBanner from '../../assets/images/login-banner.png';
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

  console.log('errors', errors);

  const submitForm = (data: LoginSchemaType) => {
    debugger;
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      className="w-screen h-screen bg-gray-100"
    >
      <Stack className="w-full h-full bg-white shadow-md lg:rounded-md shadow-gray-300 lg:w-194 lg:h-120">
        <Box className="grid h-full lg:grid-cols-2">
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
                <h3 className="text-2xl font-bold">Login</h3>

                <Box className="grid gap-4 mt-8">
                  <Stack
                    direction="column"
                    className="gap-0.5"
                  >
                    <FormLabel
                      title="Employee ID"
                      required
                    />
                    <Controller
                      name="employeeId"
                      control={control}
                      render={({ field: { value = '', onChange }, fieldState: { error } }) => (
                        <TextField
                          value={value}
                          onChange={onChange}
                          placeholder="Employee ID"
                          autoFocus
                          variant="filled"
                          error={!!error?.message}
                          helperText={error?.message}
                          size="small"
                          className="block"
                          fullWidth
                        />
                      )}
                    />
                    {/* <FormInput
                      name="employeeId"
                      autoFocus
                      register={register}
                      placeholder="Employee ID"
                      error={errors.employeeId}
                    /> */}
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
                      error={errors.employeeId}
                    />
                  </Stack>
                </Box>
                <Stack
                  marginTop={5}
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
