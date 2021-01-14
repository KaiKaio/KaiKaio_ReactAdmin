import React, {
  FC, HTMLAttributes, ComponentType, useContext,
} from 'react';
import { Route, Redirect } from 'react-router-dom';

import { globalContext } from 'src/App';

interface IProrps extends HTMLAttributes<HTMLDivElement> {
  component: ComponentType<any>;
  path: string;
  exact?: boolean;
  stict?: boolean;
}

const AuthorizedRoute: FC<IProrps> = ({
  component, path, exact = false, stict = false,
}:IProrps) => {
  const GlobalContext: any = useContext(globalContext);
  return GlobalContext.state.loginStatus ? (
    <Route path={path} exact={exact} strict={stict} component={component} />
  ) : (
    <Redirect to="/login" />
  );
};

AuthorizedRoute.defaultProps = {
  exact: false,
  stict: false,
};

export default AuthorizedRoute;
