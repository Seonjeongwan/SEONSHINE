import React from 'react';
import { Navigate } from 'react-router-dom';

import { paths } from '@/routes/paths';
import { RoleEnum } from '@/types/user';
import { getUserFromCache } from '@/utils/persistCache/auth';

import useAuthStore from '@/store/auth.store';

type AllowedRole = RoleEnum;

type ProtectedLayoutPropsType = {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
};

const ProtectedLayout: React.FC<ProtectedLayoutPropsType> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuthStore();
  const authenticate = isAuthenticated();

  if (!authenticate) {
    return (
      <Navigate
        to={paths.login}
        replace
      />
    );
  }

  if (currentUser && !allowedRoles.includes(currentUser.role_id)) {
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
