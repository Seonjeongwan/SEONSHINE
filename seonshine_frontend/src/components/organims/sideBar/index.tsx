import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { Logout, Notifications } from '@mui/icons-material';
import { Avatar, Badge, Box, IconButton, Stack, Typography } from '@mui/material';

import logo from '@/assets/images/logo.png';
import { menuItems } from '@/constants/menu';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';

import UserProfileModal from '../userProfileModal';
import { iconMap } from './constants';
import { MenuItemType, SidebarPropsType } from './types';

export type userType = {
  user_id: string;
  role_id: string;
  full_name: string;
  email: string;
  branch_id: string;
  birth_date: string;
  address: string;
  phone_number: string;
  status: string;
  profilePicture: string;
};

const Sidebar = ({ role }: SidebarPropsType) => {
  const { logout } = useAuth();
  const [user, setUser] = useState<userType>({
    user_id: 'shinhanuser',
    role_id: '1',
    full_name: 'Shinhan User',
    email: 'shinhanuser@mail.com',
    branch_id: 'Centec',
    birth_date: '10/12/2001',
    address: 'Thu Duc, HCMC',
    phone_number: '0123456789',
    status: 'Active',
    profilePicture: '',
  });

  const allowedMenuItems = menuItems.filter((item) => item.permission.includes(role));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSaveUser = (editedUser: userType) => {
    setUser(editedUser);
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      gap={6}
      className="bg-white text-black-500 h-full p-4 relative"
    >
      <Link
        to={paths.dashboard}
        className="flex items-center"
      >
        <Box
          sx={{
            width: '52px',
            height: '52px',
          }}
        >
          <img
            src={logo}
            alt="Logo"
            className="object-cover"
          />
        </Box>
        <Typography
          variant="heading3"
          component="h4"
        >
          SeonShine
        </Typography>
      </Link>

      <Stack
        justifyContent="center"
        gap={2}
      >
        <IconButton
          aria-label="notifications"
          className="w-12 h-12"
          onClick={handleOpenModal}
        >
          <Avatar className="bg-gray-200" />
          {isModalOpen && (
            <UserProfileModal
              onSave={handleSaveUser}
              user={user}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          )}
        </IconButton>

        <IconButton
          aria-label="notifications"
          className="w-12 h-12"
        >
          <Badge
            badgeContent={9}
            color="error"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Notifications
              className="text-blue-700"
              sx={{ fontSize: 24 }}
            />
          </Badge>
        </IconButton>
      </Stack>

      <Stack direction="column">
        {allowedMenuItems.map((item: MenuItemType) => {
          if (item.path === paths.dashboard) return null;
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) =>
                `flex p-4 gap-3 items-center rounded-md border-b  ${isActive ? 'bg-black-200' : 'hover:bg-black-100'}`
              }
            >
              <Icon sx={{ fontSize: 24 }} />
              <Typography variant="buttonM">{item.name}</Typography>
            </NavLink>
          );
        })}
      </Stack>

      <IconButton
        className="absolute left-8 bottom-8 p-0"
        onClick={logout}
      >
        <Logout
          sx={{ fontSize: 24 }}
          className="hover:opacity-70 text-black-500"
        />
      </IconButton>
    </Stack>
  );
};

export default Sidebar;
