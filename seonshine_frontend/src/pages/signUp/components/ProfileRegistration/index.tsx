import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack, ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, Link, MenuItem, Select, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import { labelIDByRole, RoleEnum } from '@/types/user';

import { useGetBranches } from '@/apis/hooks/userApi.hook';

import { EnterUserInformationPropsType } from '../../types';
import { SignUpSchema, SignUpSchemaType } from './schema';

const ProfileRegistration = ({ handleSubmitInformation, userType }: EnterUserInformationPropsType) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      userType,
      employeeId: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      branch_id: 0,
      address: '',
    },
  });

  const { data: branchData = [] } = useGetBranches({ enabled: true });

  const submitForm = (data: SignUpSchemaType) => {
    let modifiedData = { ...data };

    if (userType === RoleEnum.USER && !data.email.includes('@shinhan.com')) {
      modifiedData.email = data.email + '@shinhan.com';
    }

    handleSubmitInformation({ ...modifiedData, userType, branch_id: selectedBranch });
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);
  const [selectedBranch, setSelectedBranch] = useState<number | string>(0);

  return (
    <Stack
      direction="column"
      alignItems="center"
      className="w-full px-4 h-screen md:h-full sm:px-8 md:px-12 lg:px-12 bg-white rounded-lg shadow-md max-w-2xl"
    >
      <Link
        className="cursor-pointer !underline self-start pt-12"
        href="/login"
      >
        Back to Login
      </Link>
      <Box className="grid w-full h-full grid-cols-1 lg:grid-cols-1">
        <Typography
          variant="heading2"
          component="h2"
          className="text-center pt-8 pb-4"
        >
          Sign Up
        </Typography>
        <Stack
          justifyContent="center"
          alignItems="center"
          className="h-full px-2"
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
              <Box className="grid gap-8 mt-4">
                <Stack direction="column">
                  <FormLabel
                    title={
                      userType == RoleEnum.USER ? labelIDByRole[RoleEnum.USER] : labelIDByRole[RoleEnum.RESTAURANT]
                    }
                    required
                  />
                  <FormInput
                    name="employeeId"
                    register={register}
                    placeholder={
                      userType == RoleEnum.USER ? labelIDByRole[RoleEnum.USER] : labelIDByRole[RoleEnum.RESTAURANT]
                    }
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
                        onPointerUp={handleClickShowPassword}
                        onPointerDown={handleClickShowPassword}
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
                    error={errors.confirmPassword}
                  />
                </Stack>
                <Stack direction="column">
                  <FormLabel
                    title="Full name"
                    required
                  />
                  <FormInput
                    name="fullName"
                    register={register}
                    placeholder="Full name"
                    error={errors.fullName}
                  />
                </Stack>
                {userType == RoleEnum.USER ? (
                  <Stack direction={userType === RoleEnum.USER ? 'row' : 'column'}>
                    <Stack
                      direction="column"
                      className={userType == RoleEnum.USER ? 'w-full' : 'mr-2 w-1/2'}
                    >
                      <FormLabel
                        title="Email"
                        required
                      />
                      <FormInput
                        name="email"
                        register={register}
                        placeholder="Email"
                        error={errors.email}
                        className="w-full"
                        endAdornment={userType == RoleEnum.USER ? <Box>@shinhan.com</Box> : ''}
                      />
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction={'row'}>
                    <Stack
                      direction="column"
                      className={'mr-2 w-1/2'}
                    >
                      <FormLabel
                        title="Email"
                        required
                      />
                      <FormInput
                        name="email"
                        register={register}
                        placeholder="Email"
                        error={errors.email}
                        className="w-full"
                      />
                    </Stack>
                    <Stack
                      direction="column"
                      className={'w-1/2'}
                    >
                      <FormLabel
                        title="Phone number"
                        required
                      />
                      <FormInput
                        name="phoneNumber"
                        register={register}
                        placeholder="Phone Number"
                        error={errors.phoneNumber}
                        className={'w-full'}
                      />
                    </Stack>
                  </Stack>
                )}
                {userType == RoleEnum.USER && (
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                  >
                    <Stack
                      direction="column"
                      className={'mr-2 w-1/2'}
                    >
                      <FormLabel
                        title="Phone number"
                        required
                      />
                      <FormInput
                        name="phoneNumber"
                        register={register}
                        placeholder="Phone Number"
                        error={errors.phoneNumber}
                        className={userType == RoleEnum.USER ? '' : 'w-full'}
                      />
                    </Stack>
                    {userType == RoleEnum.USER && (
                      <Stack
                        direction="column"
                        className="w-1/2"
                        sx={{
                          '& .MuiTypography-root': {
                            fontSize: '12px',
                            color: '#FE0000',
                            marginTop: '4px',
                            fontFamily: 'Roboto',
                            lineHeight: '1.66',
                          },
                        }}
                      >
                        <FormLabel
                          title="Branch name"
                          required
                        />
                        <FormControl>
                          <Select
                            placeholder="Branch Name"
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            labelId="branch-select-label"
                            value={selectedBranch}
                            onChange={(e) => {
                              setSelectedBranch(e.target.value);
                              setValue('branch_id', e.target.value);
                            }}
                            size="small"
                            variant="filled"
                            error={!!errors.branch_id}
                            sx={{
                              '& .MuiSelect-select': {
                                backgroundColor: '#f2f4f8',
                                borderRadius: '4px',
                              },
                              '& .MuiSelect-icon': {
                                color: 'inherit',
                              },
                            }}
                          >
                            {Array.isArray(branchData) &&
                              branchData.map((branch) => (
                                <MenuItem
                                  key={branch.branch_id}
                                  value={branch.branch_id}
                                >
                                  {branch.branch_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                        {errors.branch_id && <Typography color="error">{errors.branch_id.message}</Typography>}
                      </Stack>
                    )}
                  </Stack>
                )}
                {userType !== RoleEnum.USER && (
                  <Stack direction="column">
                    <FormLabel
                      title="Address"
                      required
                    />
                    <FormInput
                      name="address"
                      register={register}
                      placeholder="Address"
                      error={errors.address}
                    />
                  </Stack>
                )}
              </Box>
              <Stack className="pb-10 pt-10">
                <Button
                  variant="contained"
                  className="text-lg"
                  fullWidth
                  type="submit"
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Stack>
  );
};

export default ProfileRegistration;
