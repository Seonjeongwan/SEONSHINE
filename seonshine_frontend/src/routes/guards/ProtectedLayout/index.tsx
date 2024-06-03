import React, { useEffect } from 'react';
import { Navigate, Outlet, Route, useNavigate } from 'react-router-dom';

import { paths } from '@/routes/paths';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(paths.login, { replace: true });
    }
  }, [token]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
