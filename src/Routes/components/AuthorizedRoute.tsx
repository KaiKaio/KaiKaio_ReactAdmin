import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { globalContext } from '../../App'


interface IProrps {
  component?: React.ComponentType<any>;
  path: string;
}


const AuthorizedRoute: React.FC<IProrps> = (props) => {

  const GlobalContext:any = React.useContext(globalContext)

  const { component, path } = props

  return (
    GlobalContext.state.loginStatus ? <Route path={ path } component={ component }></Route> : <Redirect to="/login" />
  );
}

export default AuthorizedRoute