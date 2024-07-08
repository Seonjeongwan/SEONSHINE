import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Box, Button, FormHelperText, Skeleton, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import ConfirmModal from '@/components/organims/confirmModal';
import { restaurantInfoSchema, RestaurantInfoSchemaType } from '@/components/organims/restaurantProfileModal/schema';

import { avatarBaseURL } from '@/constants/image';
import { useAuth } from '@/hooks/useAuth';
import {
  dayByWeekday,
  DayEnum,
  labelRoleById,
  labelUserStatus,
  RestaurantDetailType,
  RoleEnum,
  UploadImagePayloadType,
  UserStatusEnum,
} from '@/types/user';
import { isValidImageFile } from '@/utils/file';

import {
  useChangeStatusApi,
  useChangeUserAvatarApi,
  useGetRestaurantDetailApi,
  useUpdateRestaurantApi,
} from '@/apis/hooks/userApi.hook';

import {
  deactivateAccountDescription,
  deactivateAccountTitle,
  profileImageDeleteDescription,
  profileImageDeleteTitle,
} from '../contants';

type RestaurantProfilePropsType = {
  userId: string;
};

const fields = [
  { name: 'user_id', label: 'ID', disabled: true },
  {
    name: 'role_id',
    label: 'Type of User',
    disabled: true,
    useLabel: (id: string) => labelRoleById[id as RoleEnum],
  },
  { name: 'username', label: 'Full name', disabled: false },
  { name: 'email', label: 'Email', disabled: true },
  {
    name: 'weekday',
    label: 'Assigned date',
    disabled: true,
    useLabel: (weekday: string) => dayByWeekday[Number(weekday) as DayEnum] || 'None',
  },
  { name: 'address', label: 'Address', disabled: false },
  { name: 'phone_number', label: 'Phone Number', disabled: false },
  {
    name: 'user_status',
    label: 'Status',
    disabled: true,
    useLabel: (id: string) => labelUserStatus[Number(id) as UserStatusEnum],
  },
];

const RestaurantProfile = ({ userId }: RestaurantProfilePropsType) => {
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDeleteAvatarModalOpen, setIsDeleteAvatarModalOpen] = useState(false);
  const [isDeactiveModalOpen, setIsDeactivateModalOpen] = useState(false);

  const { data: restaurant, isLoading } = useGetRestaurantDetailApi({ params: { restaurant_id: userId } });

  const { mutate: updateUser, isPending } = useUpdateRestaurantApi({ userId });
  const { mutate: changeUserAvatar } = useChangeUserAvatarApi(userId);
  const { mutate: changeStatus } = useChangeStatusApi();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<RestaurantInfoSchemaType>({
    defaultValues: {
      username: restaurant?.username || '',
      address: restaurant?.address || '',
      phone_number: restaurant?.phone_number || '',
    },
    resolver: zodResolver(restaurantInfoSchema),
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
              queryClient.invalidateQueries({ queryKey: ['getRestaurantDetail'] });
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
        queryClient.invalidateQueries({ queryKey: ['getRestaurantDetail'] });
        let photoInput = document.getElementById('upload-photo') as HTMLInputElement;
        photoInput.value = '';
      },
      onError: () => setUploadError('Cannot delete avatar.'),
    });
    setIsDeleteAvatarModalOpen(false);
  };

  const onClickRemoveAvatar = () => {
    setIsDeleteAvatarModalOpen(true);
  };

  const handleSave = (data: RestaurantInfoSchemaType) => {
    updateUser(
      {
        ...data,
      },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries({ queryKey: ['getRestaurantDetail'] });
          toast.success(res.message);
          setIsEditing(false);
        },
        onError: () => {
          toast.error('Update restaurant failed!');
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
        user_id: restaurant?.user_id as string,
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
    restaurant &&
      reset({
        ...(restaurant as RestaurantInfoSchemaType),
      });
    setIsAvatarDeleted(false);
  }, [restaurant]);

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
          className="bg-white w-full"
          direction="column"
        >
          <Stack
            alignItems="center"
            justifyContent="center"
            gap={12}
            className="w-full bg-gray-200 px-12 py-8"
          >
            <Box className="relative">
              {isLoading ? (
                <Skeleton className="w-44 h-44" />
              ) : (
                <Avatar
                  src={
                    isAvatarDeleted || !restaurant?.profile_picture_url
                      ? ''
                      : `${avatarBaseURL}${restaurant?.profile_picture_url}`
                  }
                  className="w-44 h-44 bg-white text-black-500"
                />
              )}
              {uploadError && <FormHelperText className="text-red-500 text-xs m-2">{uploadError}</FormHelperText>}
            </Box>
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
                disabled={!restaurant?.profile_picture_url}
                onClick={onClickRemoveAvatar}
              >
                Remove
              </button>
            </Stack>
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
                  <Box
                    key={field.name}
                    className="flex items-center mb-4"
                  >
                    <div className="w-1/2 font-bold">{field.label}</div>
                    <div className="w-1/2">
                      {isEditing && !field.disabled ? (
                        <Controller
                          name={field.name as keyof RestaurantInfoSchemaType}
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
                        <span>{field.useLabel(restaurant?.[field.name as keyof RestaurantDetailType] as string)}</span>
                      ) : (
                        <span>{restaurant?.[field.name as keyof RestaurantDetailType]}</span>
                      )}
                    </div>
                  </Box>
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
          className="bg-white w-full py-6"
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

export default RestaurantProfile;
