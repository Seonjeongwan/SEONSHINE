import React from 'react';
import { Navigate } from 'react-router-dom';

import { paths } from '@/routes/paths';
import { RoleEnum } from '@/types/user';
import { getAccessToken } from '@/utils/persistCache/token';

import useAuthStore from '@/store/auth.store';

type AllowedRole = RoleEnum | 'Admin' | 'User' | 'Restaurant' | '';

type ProtectedLayoutPropsType = {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
};

const ProtectedLayout: React.FC<ProtectedLayoutPropsType> = ({ children, allowedRoles }) => {
  const token = getAccessToken()?.accessToken;
  const { currentUser } = useAuthStore();

  if (!token) {
    return (
      <Navigate
        to={paths.login}
        replace
      />
    );
  }

  if (!currentUser?.role_id) {
    return (
      <Navigate
        to={paths.main}
        replace
      />
    );
  }

  if (!allowedRoles.includes(currentUser?.role_id as AllowedRole)) {
    return (
      <Navigate
        to={paths.main}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
