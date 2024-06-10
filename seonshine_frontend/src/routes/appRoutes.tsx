import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AdminPage from '@/pages/admin';
import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';
import MainPage from '@/pages/main';
import PageNotFound from '@/pages/pageNotFound';
import SignUpPage from '@/pages/signUp';
import ChooseUserType from '@/pages/signUp/ChooseUserType';

import { RoleEnum } from '@/types/user';

import useAuthStore from '@/store/auth.store';

import AuthenticateLayout from './guards/AuthenticateLayout';
import ProtectedLayout from './guards/ProtectedLayout';
import { paths } from './paths';
import ProfileRegistration from '@/pages/signUp/ProfileRegistration';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const authenticate = isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route element={<AuthenticateLayout />}>
          <Route
            path={paths.login}
            element={authenticate ? <Navigate to={paths.main} /> : <LoginPage />}
          />
          <Route
            path={paths.forgotPassword}
            element={authenticate ? <Navigate to={paths.main} /> : <ForgotPasswordPage />}
          />
          <Route
            path={paths.signUp}
            element={authenticate ? <Navigate to={paths.main} /> : <ProfileRegistration />}
          />
        </Route>

        <Route
          path={paths.main}
          element={authenticate ? <MainPage /> : <Navigate to={paths.login} />}
        />
        <Route
          path={paths.pageNotFound}
          element={<PageNotFound />}
        />

        <Route
          index
          element={
            authenticate ? (
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

export default App;
