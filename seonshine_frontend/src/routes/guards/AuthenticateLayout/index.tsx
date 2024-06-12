import { Navigate, Outlet } from 'react-router-dom';

import { Box } from '@mui/material';

import { paths } from '@/routes/paths';

import useAuthStore from '@/store/auth.store';

const AuthenticateLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const authenticate = isAuthenticated();

  if (authenticate) {
    return (
      <Navigate
        to={paths.index}
        replace
      />
    );
  }

  return (
    <Box className="bg-gray-100">
      <Outlet />
    </Box>
  );
};

export default AuthenticateLayout;
