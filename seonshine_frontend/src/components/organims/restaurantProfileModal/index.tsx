import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Avatar, Box, Button, IconButton, Modal, Skeleton } from '@mui/material';

import { RestaurantDetailType } from '@/types/user';
import { isValidImageFile } from '@/utils/file';

import { useGetRestaurantDetailApi } from '@/apis/hooks/userApi.hook';

import { RestaurantInfoSchema, restaurantInfoSchema } from './schema';

interface UserProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const fields = [
  { name: 'user_id', label: 'ID', disabled: true },
  { name: 'role_id', label: 'Type of User', disabled: true },
  { name: 'username', label: 'Full name', disabled: false },
  { name: 'email', label: 'Email', disabled: true },
  { name: 'weekday', label: 'Assigned date', disabled: true },
  { name: 'address', label: 'Address', disabled: false },
  { name: 'phone_number', label: 'Phone Number', disabled: false },
  { name: 'user_status', label: 'Status', disabled: true },
];

const RestaurantProfileModal: React.FC<UserProfileModalProps> = ({ userId, isOpen, onClose }) => {
  const { data: restaurant, isLoading } = useGetRestaurantDetailApi({ restaurant_id: userId });

  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(restaurant?.profile_picture_url || '');

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: restaurant?.username,
      address: restaurant?.address,
      phone_number: restaurant?.phone_number,
    },
    resolver: zodResolver(restaurantInfoSchema),
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = (data: any) => {
    // onSave({ ...user, ...data, profilePicture: previewUrl });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(restaurant?.profile_picture_url || '');
    reset({
      username: restaurant?.username,
      address: restaurant?.address,
      phone_number: restaurant?.phone_number,
    });
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false);
    setPreviewUrl(restaurant?.profile_picture_url || '');
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const validationResult = isValidImageFile(file);
      if (!validationResult.isValid) {
        setUploadError(validationResult.messageError || null);
        return;
      } else {
        setUploadError(null);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      try {
        // will call api upload photo later
        // const uploadedImageUrl = await uploadToServer(file);
        // setPreviewUrl(uploadedImageUrl);
        console.log('upload image api');
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadError('Error uploading image. Please try again.');
      }
    }
  };

  useEffect(() => {
    reset({
      username: restaurant?.username,
      address: restaurant?.address,
      phone_number: restaurant?.phone_number,
    });
  }, [restaurant]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="user-profile-modal-title"
      aria-describedby="user-profile-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full md:w-2/3 lg:w-2/5 bg-white shadow-xl rounded-lg">
        <Box className="flex flex-col md:flex-row">
          <Box className="w-full md:w-1/4 bg-gray-100 flex flex-col items-center rounded-lg p-4 md:p-0">
            {isLoading ? (
              <Skeleton
                height={84}
                width={84}
                className="mt-4 md:mt-12"
              />
            ) : (
              <Avatar
                alt={restaurant?.username}
                src={previewUrl}
                className="w-24 h-24 mt-4 md:mt-12"
              />
            )}
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
                className="hover:bg-green-300 hover:text-white hover:outline-green-300 bg-white text-green-200 font-bold outline outline-2 outline-green-200 mx-4 mt-4 md:mt-8 rounded-xl"
              >
                Select Photo
              </Button>
            </label>
            {uploadError && <p className="text-red-500 text-xs m-2">{uploadError}</p>}
          </Box>
          <Box className="w-full md:w-3/4 p-4 md:p-16 relative">
            <IconButton
              className="absolute top-6 right-6"
              onClick={handleEditToggle}
            >
              {!isEditing ? <EditOutlinedIcon /> : <EditIcon />}
            </IconButton>

            <form onSubmit={handleSubmit(handleSave)}>
              {fields.map((field) => {
                return isLoading ? (
                  <Skeleton height={30} />
                ) : (
                  <Box
                    key={field.name}
                    className="flex items-center mb-4"
                  >
                    <div className="w-1/2 font-bold">{field.label}</div>
                    <div className="w-1/2">
                      {isEditing && !field.disabled ? (
                        <Controller
                          name={field.name as keyof RestaurantInfoSchema}
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
                      ) : (
                        <span>{restaurant?.[field.name as keyof RestaurantDetailType]}</span>
                      )}
                    </div>
                  </Box>
                );
              })}
              <Box className="flex justify-end">
                {isEditing ? (
                  <>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCancel}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleClose}>OK</Button>
                )}
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default RestaurantProfileModal;
