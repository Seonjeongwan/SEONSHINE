import { Navigate, Outlet } from 'react-router-dom';

const AuthenticateLayout = () => {
  // const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // if (token) {
  //   return (
  //     <Navigate
  //       to={'/test'}
  //       replace
  //     />
  //   );
  // }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticateLayout;
