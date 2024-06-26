import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';
import MenuManagement from '@/pages/menuManagement';
import OrderManagement from '@/pages/orderManagement';
import PageNotFound from '@/pages/pageNotFound';
import RestaurantAssignment from '@/pages/restaurantAssignment';
import SignUpPage from '@/pages/signUp';
import UserManagement from '@/pages/userManagement';

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
          element={<ProtectedLayout allowedRoles={[RoleEnum.ADMIN, RoleEnum.USER, RoleEnum.RESTAURANT]} />}
        >
          <Route
            index
            element={<Dashboard />}
          />
        </Route>
        <Route
          path={paths.user.index}
          element={<ProtectedLayout allowedRoles={[RoleEnum.ADMIN]} />}
        >
          <Route
            index
            element={<UserManagement />}
          />
        </Route>
        <Route
          path={paths.restaurantAssignment.index}
          element={<ProtectedLayout allowedRoles={[RoleEnum.ADMIN]} />}
        >
          <Route
            index
            element={<RestaurantAssignment />}
          />
        </Route>
        <Route
          path={paths.restaurant.menu}
          element={<ProtectedLayout allowedRoles={[RoleEnum.ADMIN, RoleEnum.RESTAURANT]} />}
        >
          <Route
            index
            element={<MenuManagement />}
          />
        </Route>
        <Route
          path={paths.order.index}
          element={<ProtectedLayout allowedRoles={[RoleEnum.ADMIN, RoleEnum.RESTAURANT, RoleEnum.USER]} />}
        >
          <Route
            index
            element={<OrderManagement />}
          />
        </Route>
        <Route
          path={paths.order.index}
          element={<ProtectedLayout allowedRoles={[RoleEnum.ADMIN]} />}
        >
          <Route
            index
            element={<OrderManagement />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
