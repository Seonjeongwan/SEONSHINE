import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminPage from '@/pages/admin';
import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';
import MainPage from '@/pages/main';
import PageNotFound from '@/pages/pageNotFound';
import SignUpPage from '@/pages/signUp';
import TestPage from '@/pages/testPage';

import { RoleEnum } from '@/types/user';

import useAuthStore from '@/store/auth.store';

import AuthenticateLayout from './guards/AuthenticateLayout';
import ProtectedLayout from './guards/ProtectedLayout';
import { paths } from './paths';

const AppRoutes = () => {
  const { isAuthenticated } = useAuthStore();
  const authenticate = isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route element={<AuthenticateLayout />}>
          <Route
            path={paths.login}
            element={<LoginPage />}
          />
          <Route
            path={paths.forgotPassword}
            element={<ForgotPasswordPage />}
          />
          <Route
            path={paths.signUp}
            element={<SignUpPage />}
          />
        </Route>

        <Route
          index
          element={<Navigate to={paths.dashboard} />}
        />

        <Route
          path={paths.pageNotFound}
          element={<PageNotFound />}
        />

        <Route
          path={'*'}
          element={
            authenticate ? (
              <Navigate
                to={paths.pageNotFound}
                replace
              />
            ) : (
              <Navigate
                to={paths.login}
                replace
              />
            )
          }
        />
        {/* Access Control List  routing example*/}

        <Route
          path={paths.dashboard}
          element={
            <ProtectedLayout
              allowedRoles={[RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.RESTAURANT]}
              children={<TestPage />}
            />
          }
        />
        <Route
          path={paths.admin}
          element={
            <ProtectedLayout
              allowedRoles={[RoleEnum.ADMIN]}
              children={<AdminPage />}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
