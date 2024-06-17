import React, { useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Avatar, Box, Button, Modal } from '@mui/material';

import { userType } from '../sideBar';

interface UserProfileModalProps {
  user: userType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: userType) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<userType>({ ...user });

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false);
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
              alt={user.username}
              src={user.profilePicture}
              className="w-24 h-24 mt-12"
            />
            <Button className="hover:bg-green-300 hover:text-white hover:outline-green-300 bg-white text-green-200 font-bold outline outline-2 outline-green-200 mx-4 mt-8 rounded-xl">
              Upload Photo
            </Button>
          </Box>
          <Box className="w-3/4 p-16 relative">
            {!isEditing ? (
              <>
                <div className="absolute top-6 right-6">
                  <EditOutlinedIcon
                    onClick={handleEditToggle}
                    className="cursor-pointer"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="absolute top-6 right-6">
                  <EditIcon
                    onClick={handleEditToggle}
                    className="cursor-pointer"
                  />
                </div>
              </>
            )}
            {fields.map((field) => (
              <Box
                key={field.name}
                className="flex items-center mb-4"
              >
                <div className="w-1/2 font-bold">{field.label}</div>
                <div className="w-1/2">
                  {isEditing ? (
                    <form action="">
                      <input
                        type="text"
                        disabled={field.disabled}
                        name={field.name}
                        value={editedUser[field.name as keyof userType]}
                        onChange={handleChange}
                        className={`bg-white w-full outline-none ${field.disabled ? '' : 'border-b-2 border-black-500'}`}
                      />
                    </form>
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={handleEditToggle}
                    >
                      {editedUser[field.name as keyof userType]}
                    </span>
                  )}
                </div>
              </Box>
            ))}
            <Box className="flex justify-end">
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
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
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
