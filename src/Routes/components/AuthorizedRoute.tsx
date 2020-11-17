// @ts-nocheck
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { globalContext } from '../../App'
interface IProrps {
  component?: React.ComponentType<any>;
  path?: string;
  exact?: boolean;
  stict?: boolean;
}


const AuthorizedRoute: React.FC<IProrps> = (props) => {

  const GlobalContext:any = React.useContext(globalContext)

  const { component, path, exact = false, stict = false } = props
  console.log(path)
  return (
    GlobalContext.state.loginStatus ? <Route path={ path } exact={exact} strict={stict} component={ component }></Route> : <Redirect to="/login" />
  );
}

export default AuthorizedRoute