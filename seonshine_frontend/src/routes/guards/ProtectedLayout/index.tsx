import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { paths } from '@/routes/paths';
import { getAccessToken } from '@/utils/persistCache/token';

import useAuthStore from '@/store/auth.store';
import { callme } from '@/apis/auth';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const authenticated = isAuthenticated();
  const token = getAccessToken();

  useEffect(() => {
    callme();
  }, [token.accessToken]);

  if (!authenticated) {
    return (
      <Navigate
        to={paths.login}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedLayout;
