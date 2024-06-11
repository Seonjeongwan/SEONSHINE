import { Link, useLocation } from 'react-router-dom';

import { Box, Breadcrumbs, Stack, Typography } from '@mui/material';

import Sidebar from '@/components/organims/sideBar';

import { RoleEnum } from '@/types/user';

type MainLayoutProps = {
  children: React.ReactNode;
  role: RoleEnum;
};

const MainLayout = ({ children, role }: MainLayoutProps) => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <Sidebar role={role} />
      </div>
      <div className="w-4/5 bg-gray-100 p-4">
        <Stack spacing={2}>
          <Typography variant="h4">Page Title</Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/">Home</Link>
            {paths.map((path, index) => (
              <Link
                key={`${path}_${index}`}
                to={`/${paths.slice(0, index + 1).join('/')}`}
              >
                {path}
              </Link>
            ))}
          </Breadcrumbs>
          <Box>{children}</Box>
        </Stack>
      </div>
    </div>
  );
};

export default MainLayout;
