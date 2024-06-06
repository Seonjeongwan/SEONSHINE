import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';

import { paths } from './paths';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={paths.login}
          element={<LoginPage />}
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
