import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

const AuthenticateLayout = () => {
  return (
    <Box className="bg-gray-100">
      <Outlet />
    </Box>
  );
};

export default AuthenticateLayout;
