import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Box, Button, FormHelperText, Skeleton, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import DatePicker from '@/components/molecules/datePicker';
import ConfirmModal from '@/components/organims/confirmModal';
import { userInfoSchema, UserInfoSchemaType } from '@/components/organims/userProfileModal/schema';

import { avatarBaseURL } from '@/constants/image';
import { useAuth } from '@/hooks/useAuth';
import {
  labelRoleById,
  labelUserStatus,
  RoleEnum,
  UploadImagePayloadType,
  UserDetailType,
  UserStatusEnum,
} from '@/types/user';
import { isValidImageFile } from '@/utils/file';

import {
  useChangeStatusApi,
  useChangeUserAvatarApi,
  useGetBranches,
  useGetUserDetailApi,
  useUpdateUserApi,
} from '@/apis/hooks/userApi.hook';

import {
  deactivateAccountDescription,
  deactivateAccountTitle,
  profileImageDeleteDescription,
  profileImageDeleteTitle,
} from '../contants';

type UserProfilePropsType = {
  userId: string;
};

const fields: Array<{
  name: keyof UserDetailType;
  label: string;
  disabled: boolean;
  useLabel?: (id: string) => string;
}> = [
  { name: 'user_id', label: 'ID', disabled: true },
  {
    name: 'role_id',
    label: 'Type of User',
    disabled: true,
    useLabel: (id: string) => labelRoleById[id as RoleEnum],
  },
  { name: 'username', label: 'Full name', disabled: false },
  { name: 'email', label: 'Email', disabled: true },
  { name: 'branch_name', label: 'Branch', disabled: false },
  { name: 'birth_date', label: 'Birth Date', disabled: false },
  { name: 'address', label: 'Address', disabled: false },
  { name: 'phone_number', label: 'Phone Number', disabled: false },
  {
    name: 'user_status',
    label: 'Status',
    disabled: true,
    useLabel: (id: string) => labelUserStatus[Number(id) as UserStatusEnum],
  },
];

const UserProfile = ({ userId }: UserProfilePropsType) => {
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
  const [isDeactiveModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { data: user, isLoading } = useGetUserDetailApi({ params: { user_id: userId } });

  const { mutate: updateUser, isPending } = useUpdateUserApi({ userId });
  const { mutate: changeUserAvatar } = useChangeUserAvatarApi(userId);
  const { data: branchData } = useGetBranches({ enabled: true });
  const { mutate: changeStatus } = useChangeStatusApi();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UserInfoSchemaType>({
    defaultValues: {
      username: user?.username || '',
      birth_date: user?.birth_date as string | null,
      branch_id: user?.branch_id as number,
      address: user?.address || '',
      phone_number: user?.phone_number || '',
    },
    resolver: zodResolver(userInfoSchema),
  });

  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validationResult = isValidImageFile(file);
      if (!validationResult.isValid) {
        setUploadError(validationResult.messageError || null);
        return;
      } else {
        const imagePayload: UploadImagePayloadType = { file };
        setUploadError(null);

        const reader = new FileReader();
        reader.readAsDataURL(file);

        try {
          changeUserAvatar(imagePayload, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['getUserDetail'] });
              toast.success('Your profile image has been updated.');
            },
            onError: () => setUploadError('Cannot upload image.'),
          });
        } catch (error) {
          setUploadError('Error uploading image. Please try again.');
        }
      }
    }
  };

  const handleAvatarDelete = () => {
    setIsAvatarDeleted(true);
    const emptyFilePayload: UploadImagePayloadType = { file: new File([], '') };
    changeUserAvatar(emptyFilePayload, {
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ['getUserDetail'] });
        const photoInput = document.getElementById('upload-photo') as HTMLInputElement;
        photoInput.value = '';
      },
      onError: () => setUploadError('Cannot delete avatar.'),
    });
    setIsDeleteAvatarModalOpen(false);
  };

  const onClickRemoveAvatar = () => {
    setIsDeleteAvatarModalOpen(true);
  };

  const handleSave = (data: UserInfoSchemaType) => {
    updateUser(
      {
        ...data,
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['getUserDetail'] });
          toast.success(res.message);
          setIsEditing(false);
        },
        onError: () => {
          toast.error('Update user failed!');
        },
      },
    );
  };

  const onClickDeactivateButton = () => {
    setIsDeactivateModalOpen(true);
  };

  const handleDeactivateAccount = () => {
    changeStatus(
      {
        user_id: user?.user_id as string,
        status: UserStatusEnum.CLOSE,
      },
      {
        onSuccess: () => {
          toast.success('This account has been deactivated. Please contact admin to reactivate account.', {
            autoClose: 2000,
            onClose: () => {
              logout();
            },
          });
        },
        onError: () => {
          toast.error("Can't deactivate this account!");
        },
      },
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  useEffect(() => {
    user &&
      reset({
        ...(user as UserInfoSchemaType),
        birth_date: user.birth_date,
      });
    setIsAvatarDeleted(false);
  }, [user]);

  return (
    <Stack
      direction="column"
      className="w-full md:w-150"
    >
      <Stack direction="column">
        <Typography
          variant="heading4"
          component="h3"
          className="my-4"
        >
          User List
        </Typography>
        <Stack
          className="bg-white w-full rounded-md"
          direction="column"
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            gap={12}
            className="w-full bg-gray-200 px-12 py-8 rounded-t-md"
          >
            <Box className="relative">
              {isLoading ? (
                <Skeleton className="w-44 h-44" />
              ) : (
                <Avatar
                  src={
                    isAvatarDeleted || !user?.profile_picture_url ? '' : `${avatarBaseURL}${user?.profile_picture_url}`
                  }
                  className="w-44 h-44 bg-white text-black-500"
                />
              )}
              {uploadError && <FormHelperText className="text-red-500 text-xs m-2">{uploadError}</FormHelperText>}
            </Box>
            {isEditing && (
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                gap={4}
                className="px-4"
              >
                <input
                  accept="image/*"
                  className="hidden"
                  id="upload-photo"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="upload-photo">
                  <Button
                    component="span"
                    className="hover:bg-green-300 hover:text-white hover:outline-green-300 bg-white text-green-200 outline outline-2 outline-green-200 rounded-xl"
                  >
                    <Typography className="text-lg font-bold text-center">Select Photo</Typography>
                  </Button>
                </label>
                <button
                  className="text-center text-lg font-bold hover:opacity-70 disabled:opacity-70"
                  disabled={!user?.profile_picture_url}
                  onClick={onClickRemoveAvatar}
                >
                  Remove
                </button>
              </Stack>
            )}
          </Stack>
          <Box className="w-full py-8 px-16">
            <form onSubmit={handleSubmit(handleSave)}>
              {fields.map((field) => {
                return isLoading || isPending ? (
                  <Skeleton
                    height={35}
                    key={field.name}
                  />
                ) : (
                  <Stack
                    key={field.name}
                    justifyContent="center"
                    gap={2}
                    className="mb-4"
                  >
                    <div className="w-1/2 text-lg font-bold">{field.label}</div>
                    <div className="w-1/2">
                      {isEditing && field.name === 'birth_date' && !field.disabled ? (
                        <DatePicker
                          name={field.name}
                          control={control}
                          disabled={field.disabled}
                          varirant="small"
                        />
                      ) : isEditing && field.name === 'branch_name' && !field.disabled ? (
                        <Controller
                          name="branch_id"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <select
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className={`bg-white w-full outline-none border-b-2 border-black ${
                                  !!error ? 'border-red-500' : 'border-black'
                                }`}
                              >
                                {Array.isArray(branchData) &&
                                  branchData.map((branch) => (
                                    <option
                                      key={branch.branch_id}
                                      value={branch.branch_id}
                                    >
                                      {branch.branch_name}
                                    </option>
                                  ))}
                              </select>
                              {error && <p className="text-red-500 text-xs">{error.message}</p>}
                            </>
                          )}
                        />
                      ) : isEditing && !field.disabled ? (
                        <Controller
                          name={field.name as keyof UserInfoSchemaType}
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <input
                                {...field}
                                value={field.value || ''}
                                type="text"
                                disabled={field.disabled}
                                className={`bg-white w-full outline-none border-b-2 border-black ${
                                  error ? 'border-red-500' : 'border-black'
                                }`}
                              />
                              {error && <p className="text-red-500 text-xs">{error.message}</p>}
                            </>
                          )}
                        />
                      ) : !!field.useLabel ? (
                        <span>{field.useLabel(user?.[field.name] as string)}</span>
                      ) : (
                        <span>{user?.[field.name as keyof UserDetailType]}</span>
                      )}
                    </div>
                  </Stack>
                );
              })}
              <Box className="flex justify-center">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!isDirty}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleCancel}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    className="text-base font-bold uppercase bg-blue-400 px-8 py-1"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </form>
          </Box>
        </Stack>
      </Stack>
      <Stack direction="column">
        <Typography
          variant="heading4"
          component="h3"
          className="my-4"
        >
          Activity
        </Typography>
        <Stack
          className="bg-white w-full py-6 rounded-md"
          direction="column"
          alignItems="center"
          gap={4}
        >
          <Typography
            variant="heading4"
            component="h4"
          >
            Deactivate your account?
          </Typography>
          <Button
            className="bg-red-300 hover:bg-red-500 rounded-full"
            onClick={onClickDeactivateButton}
          >
            Deactivate
          </Button>
        </Stack>
      </Stack>
      <ConfirmModal
        open={isDeleteAvatarModalOpen}
        title={profileImageDeleteTitle}
        description={profileImageDeleteDescription}
        handleClose={() => setIsDeleteAvatarModalOpen(false)}
        handleConfirm={handleAvatarDelete}
      />
      <ConfirmModal
        open={isDeactiveModalOpen}
        title={deactivateAccountTitle}
        description={deactivateAccountDescription}
        handleClose={() => setIsDeactivateModalOpen(false)}
        handleConfirm={handleDeactivateAccount}
      />
    </Stack>
  );
};

export default UserProfile;
