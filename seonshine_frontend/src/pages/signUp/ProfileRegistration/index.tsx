import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import { LoginSchema, LoginSchemaType } from '@/pages/login/schemas';

const ProfileRegistration = () => {
  const {
    register,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      employeeId: '',
      password: '',
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      className="min-h-screen py-8"
    >
      <Stack
        direction="column"
        alignItems="center"
        className="w-full px-24 bg-white rounded-lg shadow-md sm:w-150 md:w-150 xl:w-150 max-w-screen"
      >
        <Box className="grid w-full h-full grid-cols-1 lg:grid-cols-1">
          <Typography
            variant="heading2"
            component="h2"
            className="text-center pt-8"
          >
            Sign Up
          </Typography>
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
                <Box className="grid gap-2 mt-4">
                  <Stack direction="column">
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
                  <Stack direction="column">
                    <FormLabel
                      title="Password"
                      required
                    />
                    <FormInput
                      name="password"
                      register={register}
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <IconButton
                          onMouseDown={handleClickShowPassword}
                          onMouseUp={handleClickShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      }
                      error={errors.password}
                    />
                  </Stack>
                  <Stack direction="column">
                    <FormLabel
                      title="Confirm Password"
                      required
                    />
                    <FormInput
                      name="confirmPassword"
                      autoFocus
                      register={register}
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <IconButton
                          onMouseDown={handleClickShowConfirmPassword}
                          onMouseUp={handleClickShowConfirmPassword}
                        >
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      }
                      error={errors.employeeId}
                    />
                  </Stack>
                  <Stack direction="column">
                    <FormLabel
                      title="Full name"
                      required
                    />
                    <FormInput
                      name="fullName"
                      autoFocus
                      register={register}
                      placeholder="Full name"
                      error={errors.employeeId}
                    />
                  </Stack>
                  <Stack>
                    <Stack
                      className="mr-2"
                      direction="column"
                    >
                      <FormLabel
                        title="Email"
                        required
                      />
                      <FormInput
                        name="email"
                        autoFocus
                        register={register}
                        placeholder="Email"
                        error={errors.employeeId}
                      />
                    </Stack>
                    <Stack direction="column">
                      <FormLabel />
                      <FormInput
                        name="emailExtension"
                        register={register}
                        disabled
                        placeholder="@seonshine.com"
                      />
                    </Stack>
                  </Stack>
                  <Stack>
                    <Stack
                      className="mr-2"
                      direction="column"
                    >
                      <FormLabel
                        title="Phone number"
                        required
                      />
                      <FormInput
                        name="phoneNumber"
                        autoFocus
                        register={register}
                        placeholder="Phone Number"
                        error={errors.employeeId}
                      />
                    </Stack>
                    <Stack direction="column">
                      <FormLabel
                        title="Branch name"
                        required
                      />
                      <FormInput
                        name="branchName"
                        autoFocus
                        register={register}
                        placeholder="Branch name"
                        error={errors.employeeId}
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Stack className="pb-10 pt-10">
                  <Button
                    variant="contained"
                    fullWidth
                    className="text-lg"
                    type="submit"
                    // disabled={isPending}
                  >
                    Next
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
};

export default ProfileRegistration;
