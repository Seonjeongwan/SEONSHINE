import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Menu } from '@mui/icons-material';
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
  const iconRef = useRef<HTMLButtonElement>(null);
  const startPositionRef = useRef({ startY: 0, startTop: 0 });
  const isDraggingRef = useRef(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const location = useLocation();

  const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
    isDraggingRef.current = true;
    const icon = iconRef.current;
    if (!icon) return;

    const moveY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;
    const deltaY = moveY - startPositionRef.current.startY;
    let newTop = startPositionRef.current.startTop + deltaY;

    const minTop = 0;
    const maxTop = window.innerHeight - icon.offsetHeight;
    newTop = Math.max(minTop, Math.min(newTop, maxTop));

    if (icon.style.top !== `${newTop}px`) {
      icon.style.top = `${newTop}px`;
      icon.style.transform = 'translateY(0)';
    }
  };

  const handleDragEnd = () => {
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
    window.removeEventListener('touchmove', handleDragMove);
    window.removeEventListener('touchend', handleDragEnd);

    if (!isDraggingRef.current) {
      toggleSidebar();
    }
    isDraggingRef.current = false;
  };

  const handleDragStart = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    isDraggingRef.current = false;
    const icon = iconRef.current;
    if (!icon) return;

    const startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    const startTop = icon.getBoundingClientRect().top;

    startPositionRef.current = { startY, startTop };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);
  };

  useEffect(() => {
    const icon = iconRef.current;
    if (icon) {
      icon.style.position = 'absolute';
      icon.style.top = '50%';
      icon.style.left = '-8px';
      icon.style.transform = 'translateY(-50%)';

      icon.addEventListener('mousedown', handleDragStart);
      icon.addEventListener('touchstart', handleDragStart);

      return () => {
        icon.removeEventListener('mousedown', handleDragStart);
        icon.removeEventListener('touchstart', handleDragStart);
      };
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <Stack className="h-screen max-h-dvh bg-black-100 overflow-hidden">
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
        className="flex-1 overflow-hidden pt-8"
      >
        <IconButton
          ref={iconRef}
          className="md:hidden bg-black-400 rounded-md w-12 h-14 opacity-60 z-50 hover:bg-black-500"
          style={{ top: '50%', left: '0' }}
        >
          <Menu sx={{ color: 'white' }} />
        </IconButton>
        <Header />
        <Box className="flex-1 overflow-auto scroll-smooth">{children}</Box>
      </Stack>
    </Stack>
  );
};

export default MainLayout;
