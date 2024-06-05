import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/auth.store';

const ProtectedLayoutView = () => {
  const { isAuthenticated } = useAuthStore(); // Sử dụng hook từ store Zustand
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      console.log("back to login")
    }
  }, [isAuthenticated]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedLayoutView;
