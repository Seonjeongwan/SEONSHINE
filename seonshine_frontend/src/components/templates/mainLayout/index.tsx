import { useState } from 'react';

import { ArrowForwardIos } from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack } from '@mui/material';

import Header from '@/components/organims/header';
import Sidebar from '@/components/organims/sideBar';

import { RoleEnum } from '@/types/user';

type MainLayoutPropsType = {
  children: React.ReactNode;
  role: RoleEnum;
};

const MainLayout = ({ children, role }: MainLayoutPropsType) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Stack className="h-screen bg-black-100 overflow-hidden">
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={toggleSidebar}
        className="md:hidden"
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Sidebar role={role} />
      </Drawer>
      <Box className="hidden md:block">
        <Sidebar role={role} />
      </Box>
      <Stack
        direction="column"
        gap={4}
        className="flex-1 overflow-hidden py-8"
      >
        <IconButton
          className="md:hidden absolute top-1/2 -left-2 -translate-y-1/2 bg-gray-200 rounded-md w-8 h-12 opacity-50 hover:opacity-100"
          onClick={toggleSidebar}
        >
          <ArrowForwardIos />
        </IconButton>
        <Header />
        <Box className="flex-1 overflow-auto">{children}</Box>
      </Stack>
    </Stack>
  );
};

export default MainLayout;
