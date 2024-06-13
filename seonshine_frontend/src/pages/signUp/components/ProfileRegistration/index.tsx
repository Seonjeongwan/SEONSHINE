import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

import FormInput from '@/components/molecules/formEntity/input';
import { FormLabel } from '@/components/molecules/formEntity/label';

import { labelIDByRole, RoleEnum } from '@/types/user';

import { useSignUpApi } from '@/apis/hooks/signUpApi.hook';
import { useGetBranches } from '@/apis/hooks/userApi.hook';
import { BranchResponseType } from '@/apis/user';

import { EnterUserInformationPropsType } from '../../types';
import { SignUpSchema, SignUpSchemaType } from './schema';
import { SignUpRequestType } from '@/apis/signUp';

const ProfileRegistration = ({
  handleSubmitInformation,
  userType,
}: EnterUserInformationPropsType & { userType: string }) => {
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
    },
  });
  const { data: branchData = [] } = useGetBranches({ enabled: true });

  const submitForm = (data: SignUpSchemaType) => {
    handleSubmitInformation({ ...data, userType, branch_id: parseInt(selectedBranch) });
  };
  // will use custom hook useSignUp after having the API
  // const { mutate: signUpUser } = useSignUpApi();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);
  const [selectedBranch, setSelectedBranch] = useState('');

  useEffect(() => {
    console.log(branchData);
  }, []);
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      // className="min-h-[80vh]"
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
              onSubmit={handleSubmit(submitForm)}
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
                  <Stack direction={userType === RoleEnum.USER ? 'row' : 'column'}>
                    <Stack
                      direction="column"
                      className={'w-full'}
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
                  <Stack
                    direction={userType == RoleEnum.USER ? 'row' : 'column'}
                    justifyContent="space-between"
                  >
                    <Stack
                      direction="column"
                      className={userType == RoleEnum.USER ? 'mr-2 w-1/2' : 'w-full'}
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
                              setValue('branch_id', parseInt(e.target.value));
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
                </Box>
                <Stack className="pb-10 pt-10">
                  <Button
                    variant="contained"
                    fullWidth
                    className="text-lg"
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
    </Stack>
  );
};

export default ProfileRegistration;
