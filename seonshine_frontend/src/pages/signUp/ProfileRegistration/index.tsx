import React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, FormLabel, Link, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';

import { LoginSchema, LoginSchemaType } from '@/pages/login/schemas';

const ProfileRegistration = () => {
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
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="min-h-screen py-8"
    >
      <Stack
        direction="column"
        gap="24px"
        alignItems="center"
        className="w-full p-8 bg-white rounded-lg shadow-md md:w-max xl:w-240 max-w-screen"
      >
        <Typography
          variant="heading2"
          component="h2"
          className="text-center"
        >
          Sign Up
        </Typography>

        <Box className="grid w-full h-full grid-cols-1 lg:grid-cols-1">
          <Stack
            justifyContent="center"
            alignItems="center"
            className="h-full px-2"
          >
            <form
              // onSubmit={handleSubmit(submitForm)}
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
                    // src={logo}
                    className="h-8 mt-3"
                  />
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
                      // error={errors.employeeId}
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
                      // error={errors.password}
                      // type={showPassword ? 'text' : 'password'}
                      // endAdornment={
                      //   <IconButton onClick={handleClickShowPassword}>
                      //     {showPassword ? <Visibility /> : <VisibilityOff />}
                      //   </IconButton>
                      // }
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
                      // error={errors.password}
                      // type={showPassword ? 'text' : 'password'}
                      // endAdornment={
                      //   <IconButton onClick={handleClickShowPassword}>
                      //     {showPassword ? <Visibility /> : <VisibilityOff />}
                      //   </IconButton>
                      // }
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
                      // error={errors.password}
                      // type={showPassword ? 'text' : 'password'}
                      // endAdornment={
                      //   <IconButton onClick={handleClickShowPassword}>
                      //     {showPassword ? <Visibility /> : <VisibilityOff />}
                      //   </IconButton>
                      // }
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
                      // error={errors.password}
                      // type={showPassword ? 'text' : 'password'}
                      // endAdornment={
                      //   <IconButton onClick={handleClickShowPassword}>
                      //     {showPassword ? <Visibility /> : <VisibilityOff />}
                      //   </IconButton>
                      // }
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
                      // error={errors.password}
                      // type={showPassword ? 'text' : 'password'}
                      // endAdornment={
                      //   <IconButton onClick={handleClickShowPassword}>
                      //     {showPassword ? <Visibility /> : <VisibilityOff />}
                      //   </IconButton>
                      // }
                    />
                  </Stack>
                </Box>
                <Stack
                  marginTop={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Link
                    // href={paths.forgotPassword}
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
                  // disabled={isPending}
                >
                  Next
                </Button>
                <hr className="w-full my-4" />
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ProfileRegistration;
