import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { Logout, Notifications } from '@mui/icons-material';
import { Avatar, Badge, Box, IconButton, Stack, Typography } from '@mui/material';

import logo from '@/assets/images/logo.png';
import { avatarBaseURL } from '@/constants/image';
import { menuItems } from '@/constants/menu';
import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';
import { CurrentUserType, RoleEnum } from '@/types/user';

import { useGetCurrentProfileApi } from '@/apis/hooks/userApi.hook';

import ConfirmModal from '../confirmModal';
import UserProfileModal from '../userProfileModal';
import { iconMap } from './constants';
import { MenuItemType, SidebarPropsType } from './types';

const Sidebar = ({ role }: SidebarPropsType) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { logout, updateUserInfo } = useAuth();

  const navigate = useNavigate();

  const { data: userDetail } = useGetCurrentProfileApi({ enabled: true });

  const allowedMenuItems = menuItems.filter((item) => item.permission.includes(role));

  const handleOpenModal = () => (role === RoleEnum.ADMIN ? setIsModalOpen(true) : navigate(paths.profile));
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (userDetail) {
      updateUserInfo(userDetail as CurrentUserType);
    }
  }, [userDetail]);

  return (
    <Stack
      direction="column"
      alignItems="center"
      gap={6}
      className="bg-white text-black-500 h-full max-h-dvh p-4"
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
          className="mr-3"
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
          <Avatar
            src={!userDetail?.profile_picture_url ? '' : `${avatarBaseURL}${userDetail?.profile_picture_url}`}
            className="bg-gray-200"
          />
        </IconButton>
        {isModalOpen && (
          <UserProfileModal
            userId={userDetail?.user_id as string}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}

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

      <Stack
        direction="column"
        alignItems="start"
        justifyContent="space-between"
        className="h-full"
      >
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
          className="p-0 mb-4 ml-4"
          onClick={() => setIsConfirmModalOpen(true)}
        >
          <Logout
            sx={{ fontSize: 24 }}
            className="hover:opacity-70 text-black-500"
          />
        </IconButton>
      </Stack>

      <IconButton
        className="absolute left-8 bottom-8 p-0"
        onClick={() => setIsConfirmModalOpen(true)}
      >
        <Logout
          sx={{ fontSize: 24 }}
          className="hover:opacity-70 text-black-500"
        />
      </IconButton>
      <ConfirmModal
        open={isConfirmModalOpen}
        title="Log Out Confirmation"
        description="Are you sure you want to log out?"
        handleClose={() => setIsConfirmModalOpen(false)}
        handleConfirm={logout}
      />
    </Stack>
  );
};

export default Sidebar;
