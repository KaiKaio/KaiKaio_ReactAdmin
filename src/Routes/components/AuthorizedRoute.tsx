import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { globalContext } from 'src/App';

interface IProps {
  component: React.ComponentType<any>;
  path: string;
}

const AuthorizedRoute: React.FC<IProps> = ({ component: Component, path }: IProps) => {
  const GlobalContext: any = useContext(globalContext);
  return GlobalContext.state.loginStatus ? (
    <Route path={path} element={<Component />} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AuthorizedRoute;
