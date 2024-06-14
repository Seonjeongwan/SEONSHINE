import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import MainLayout from '@/components/templates/mainLayout';

import { paths } from '@/routes/paths';
import { RoleEnum } from '@/types/user';

import useAuthStore from '@/store/auth.store';

type AllowedRole = RoleEnum;

type ProtectedLayoutPropsType = {
  allowedRoles: AllowedRole[];
};

const ProtectedLayout: React.FC<ProtectedLayoutPropsType> = ({ allowedRoles }) => {
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
        to={paths.pageNotFound}
        replace
      />
    );
  }

  return (
    currentUser && (
      <MainLayout role={currentUser.role_id}>
        <Outlet />
      </MainLayout>
    )
  );
};

export default ProtectedLayout;
