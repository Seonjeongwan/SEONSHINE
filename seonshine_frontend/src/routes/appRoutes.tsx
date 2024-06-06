import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminPage from '@/pages/admin';
import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';
import MainPage from '@/pages/main';
import PageNotFound from '@/pages/pageNotFound';
import SignUpPage from '@/pages/signUp';
import TestPage from '@/pages/testPage';

import { getAccessToken } from '@/utils/persistCache/token';

import AuthenticateLayout from './guards/AuthenticateLayout';
import ProtectedLayout from './guards/ProtectedLayout';
import { paths } from './paths';

const App: React.FC = () => {
  const token = getAccessToken()?.accessToken;
  const isAuthenticated = !!token;

  return (
    <Router>
      <Routes>
        <Route element={<AuthenticateLayout />}>
          <Route
            path={paths.login}
            element={isAuthenticated ? <Navigate to={paths.main} /> : <LoginPage />}
          />
          <Route
            path={paths.forgotPassword}
            element={isAuthenticated ? <Navigate to={paths.main} /> : <ForgotPasswordPage />}
          />
          <Route
            path={paths.signUp}
            element={isAuthenticated ? <Navigate to={paths.main} /> : <SignUpPage />}
          />
        </Route>

        <Route
          path={paths.main}
          element={<MainPage />}
        />
        <Route
          path={paths.pageNotFound}
          element={<PageNotFound />}
        />

        <Route
          index
          element={
            isAuthenticated ? (
              <Navigate
                to={paths.main}
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

        <Route
          path={'*'}
          element={
            isAuthenticated ? (
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
          path={paths.admin}
          element={
            <ProtectedLayout
              allowedRoles={['']}
              children={<AdminPage />}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
