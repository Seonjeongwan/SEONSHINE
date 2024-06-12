import React from 'react';
import { Navigate } from 'react-router-dom';

import MainLayout from '@/components/templates/mainLayout';

import { useAuth } from '@/hooks/useAuth';
import { paths } from '@/routes/paths';
import { RoleEnum } from '@/types/user';
import { getUserFromCache } from '@/utils/persistCache/auth';

import useAuthStore from '@/store/auth.store';

type AllowedRole = RoleEnum;

type ProtectedLayoutPropsType = {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
};

const roleIdToRoleMap: { [key: string]: RoleEnum } = {
  0: RoleEnum.ADMIN,
  1: RoleEnum.USER,
  2: RoleEnum.RESTAURANT,
};

const ProtectedLayout: React.FC<ProtectedLayoutPropsType> = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  const authenticate = isAuthenticated();

  function getRoleByRoleId(roleId: string): RoleEnum {
    return roleIdToRoleMap[roleId];
  }

  if (!authenticate) {
    return (
      <Navigate
        to={paths.login}
        replace
      />
    );
  }

  if (!currentUser?.role_id) {
    logout();
    return null;
  }

  const userRole = roleIdToRoleMap[currentUser.role_id];

  if (!allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={paths.pageNotFound}
        replace
      />
    );
  }

  return <MainLayout role={userRole}>{children}</MainLayout>;
};

export default ProtectedLayout;
