import { Link } from 'react-router-dom';

import { Notifications } from '@mui/icons-material';
import { Avatar, Badge, Box, IconButton, Stack, Typography } from '@mui/material';

import logo from '@/assets/images/logo.png';
import { paths } from '@/routes/paths';

import { iconMap, menuItems } from './constants';
import { MenuItemType, SidebarPropsType } from './types';

const Sidebar = ({ role }: SidebarPropsType) => {
  const allowedMenuItems = menuItems.filter((item) => item.permission.includes(role));

  return (
    <Stack
      direction="column"
      alignItems="center"
      gap={8}
      className="bg-white text-black-500 h-full px-4 py-6"
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
          variant="heading4"
          component="h4"
          className="text-black-300"
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
        >
          <Avatar className="bg-gray-200" />
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
          if (item.path === '/') return;
          const Icon = iconMap[item.icon];
          return (
            <Link
              to={item.path}
              key={item.name}
              className="flex py-4 px-4 gap-3 items-center hover:bg-black-100 rounded-sm border-b"
            >
              <Icon sx={{ fontSize: 24 }} />
              <Typography variant="buttonM">{item.name}</Typography>
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default Sidebar;
