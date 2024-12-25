import React from 'react';
import {
  useLocation, Route, Switch,
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import loadable from 'src/utils/loadable';

import AuthorizedRoute from 'src/Routes/components/AuthorizedRoute';

const Home = loadable(() => import('../view/Home'));
const Create = loadable(() => import('../view/Create'));
const Music = loadable(() => import('../view/Music'));
const EditArticle = loadable(() => import('../view/EditArticle'));
const Background = loadable(() => import('../view/Background'));
const Login = loadable(() => import('../view/Login/loginPage'));
const BillChart = loadable(() => import('../view/BillChart/BillChart'));

const Routes: React.FC = () => {
  const location = useLocation();
  return (
    <TransitionGroup className="router-wrapper">
      <CSSTransition
        classNames="fade"
        appear
        key={location.pathname}
        timeout={1500}
        unmountOnExit
      >
        <Switch location={location}>
          <Route path="/login" component={Login} />
          <AuthorizedRoute path="/" component={Home} exact />
          <AuthorizedRoute path="/create" component={Create} />
          <AuthorizedRoute path="/editArticle/:id" component={EditArticle} />
          <AuthorizedRoute path="/music" component={Music} />
          <AuthorizedRoute path="/background" component={Background} />
          <AuthorizedRoute path="/Bill-chart" component={BillChart} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Routes;
