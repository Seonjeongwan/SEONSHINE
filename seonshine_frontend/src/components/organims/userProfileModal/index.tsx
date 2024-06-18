import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Avatar, Box, Button, IconButton, Modal } from '@mui/material';

import DatePicker from '@/components/molecules/datePicker/DatePicker';

import { userType } from '../sideBar';
import { UserInfoSchema, userInfoSchema } from './schema';

interface UserProfileModalProps {
  user: userType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: userType) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(user.profilePicture);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      full_name: user.full_name,
      birth_date: user.birth_date,
      address: user.address,
      phone_number: user.phone_number,
    },
    resolver: zodResolver(userInfoSchema),
  });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSave = (data: any) => {
    onSave({ ...user, ...data, profilePicture: previewUrl });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewUrl(user.profilePicture);
    reset({
      full_name: user.full_name,
      birth_date: user.birth_date,
      address: user.address,
      phone_number: user.phone_number,
    });
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false);
    setPreviewUrl(user.profilePicture);
    reset({
      full_name: user.full_name,
      birth_date: user.birth_date,
      address: user.address,
      phone_number: user.phone_number,
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Auto upload logic
      try {
        // will call api upload photo later
        // const uploadedImageUrl = await uploadToServer(file);
        // setPreviewUrl(uploadedImageUrl);
        console.log('upload image api');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const fields = [
    { name: 'user_id', label: 'ID', disabled: true },
    { name: 'role_id', label: 'Type of User', disabled: true },
    { name: 'full_name', label: 'Full name', disabled: false },
    { name: 'email', label: 'Email', disabled: true },
    { name: 'branch_id', label: 'Branch', disabled: true },
    { name: 'birth_date', label: 'Birth Date', disabled: false },
    { name: 'address', label: 'Address', disabled: false },
    { name: 'phone_number', label: 'Phone Number', disabled: false },
    { name: 'status', label: 'Status', disabled: true },
  ];

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="user-profile-modal-title"
      aria-describedby="user-profile-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/5 bg-white shadow-xl rounded-lg">
        <Box className="flex">
          <Box className="w-1/4 bg-gray-100 flex flex-col items-center rounded-lg">
            <Avatar
              alt={user.full_name}
              src={previewUrl}
              className="w-24 h-24 mt-12"
            />
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
                className="hover:bg-green-300 hover:text-white hover:outline-green-300 bg-white text-green-200 font-bold outline outline-2 outline-green-200 mx-4 mt-8 rounded-xl"
              >
                Select Photo
              </Button>
            </label>
          </Box>
          <Box className="w-3/4 p-16 relative">
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
              {fields.map((field) => (
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
                      <span>{user[field.name as keyof userType]}</span>
                    )}
                  </div>
                </Box>
              ))}
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
