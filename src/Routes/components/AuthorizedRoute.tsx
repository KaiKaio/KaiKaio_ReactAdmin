import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { globalContext } from 'src/App';

const AuthorizedRoute: React.FC = () => {
  const GlobalContext = useContext(globalContext);
  return GlobalContext.state.loginStatus ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AuthorizedRoute;
