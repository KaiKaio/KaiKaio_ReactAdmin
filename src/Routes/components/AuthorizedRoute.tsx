import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';


interface IProrps {
  component?: React.ComponentType<any>;
  path: string;
}


const AuthorizedRoute: React.FC<IProrps> = (props) => {

  const { component, path } = props
  const isLogged = sessionStorage.getItem("isLogin") === "1" ? true : false;

  return (
    isLogged ? <Route path={ path } component={ component }></Route> : <Redirect to="/login" />
  );
}

export default AuthorizedRoute