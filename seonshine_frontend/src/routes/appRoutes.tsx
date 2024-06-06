import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';
import SignUpPage from '@/pages/signUp';
import TestPage from '@/pages/testPage';

import AuthenticateLayout from './guards/authenticateLayout';
import { paths } from './paths';

const AppRoutes = () => {
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
          path={paths.test}
          element={<TestPage />}
        />
        <Route
          path={paths.forgotPassword}
          element={<ForgotPasswordPage />}
        />
        <Route
          index
          element={
            <Navigate
              to={paths.login}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
