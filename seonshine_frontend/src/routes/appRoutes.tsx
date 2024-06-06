import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import ForgotPasswordPage from '@/pages/forgotPassword';
import LoginPage from '@/pages/login';
import SignUpPage from '@/pages/signUp';
import TestPage from '@/pages/testPage';
import PageNotFound from '@/pages/pageNotFound';

import AuthenticateLayout from './guards/AuthenticateLayout';
import ProtectedRoute from './guards/ProtectedLayout';
import useAuthStore from '@/store/auth.store';
import { paths } from './paths';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore(); 
  const authenticated = isAuthenticated();

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
            element={<ProtectedRoute children={<SignUpPage />} />}
          />
        </Route>
        <Route
          path={paths.test}
          element={<ProtectedRoute children={<TestPage />} />}
        />
        <Route
          index
          element={
            authenticated ? (
              <Navigate
                to={paths.test}
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
          element={<PageNotFound />}
        />
      </Routes>
    </Router>
  );
};

export default App;
