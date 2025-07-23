import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

interface PrivateRouteProps {
  redirectPath?: string;
}

const PrivateRoute = ({ redirectPath = '/login' }: PrivateRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;