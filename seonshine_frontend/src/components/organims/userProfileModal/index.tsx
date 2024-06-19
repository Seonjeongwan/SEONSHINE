import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Avatar, Box, Button, IconButton, Modal, Skeleton } from '@mui/material';

import DatePicker from '@/components/molecules/datePicker/DatePicker';

import { isValidImageFile } from '@/utils/file';

import { useGetUserDetailApi } from '@/apis/hooks/userApi.hook';

import { userType } from '../sideBar';
import { UserInfoSchema, userInfoSchema } from './schema';

interface UserProfileModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, isOpen, onClose }) => {
  const { data: user, isLoading } = useGetUserDetailApi({ user_id: userId });

  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user?.profile_picture_url || '');

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      username: user?.username,
      birth_date: user?.birth_date,
      address: user?.address,
      phone_number: user?.phone_number,
    },
    resolver: zodResolver(userInfoSchema),
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = (data: any) => {
    // onSave({ ...user, ...data, profilePicture: previewUrl });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(user?.profile_picture_url || '');
    reset({
      username: user?.username,
      birth_date: user?.birth_date,
      address: user?.address,
      phone_number: user?.phone_number,
    });
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false);
    setPreviewUrl(user?.profile_picture_url || '');
    reset({
      username: user?.username,
      birth_date: user?.birth_date,
      address: user?.address,
      phone_number: user?.phone_number,
    });
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

  const fields = [
    { name: 'user_id', label: 'ID', disabled: true },
    { name: 'role_id', label: 'Type of User', disabled: true },
    { name: 'username', label: 'Full name', disabled: false },
    { name: 'email', label: 'Email', disabled: true },
    { name: 'branch_id', label: 'Branch', disabled: true },
    { name: 'birth_date', label: 'Birth Date', disabled: false },
    { name: 'address', label: 'Address', disabled: false },
    { name: 'phone_number', label: 'Phone Number', disabled: false },
    { name: 'user_status', label: 'Status', disabled: true },
  ];

  useEffect(() => {
    reset({
      username: user?.username,
      birth_date: user?.birth_date,
      address: user?.address,
      phone_number: user?.phone_number,
    });
  }, [user]);

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
                alt={user?.username}
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
            {!isEditing ? (
              <IconButton
                className="absolute top-6 right-6"
                onClick={handleEditToggle}
              >
                <EditOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                className="absolute top-6 right-6"
                onClick={handleEditToggle}
              >
                <EditIcon />
              </IconButton>
            )}
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
                      {isEditing && field.name === 'birth_date' && !field.disabled ? (
                        <DatePicker
                          name={field.name}
                          control={control}
                          disabled={field.disabled}
                        />
                      ) : isEditing && !field.disabled ? (
                        <Controller
                          name={field.name as keyof UserInfoSchema}
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
                        <span>{user?.[field.name as keyof userType]}</span>
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

export default UserProfileModal;
