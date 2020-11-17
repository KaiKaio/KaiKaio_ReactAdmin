import React from 'react';
import { useLocation, Route, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import loadable from '../utils/loadable'

import AuthorizedRoute from './components/AuthorizedRoute'

const Home = loadable(() => import('../view/Home'))
const Create = loadable(() => import('../view/Create'))
const Music = loadable(() => import('../view/Music'))
const EditArticle = loadable(() => import('../view/EditArticle'))
const Background = loadable(() => import('../view/Background'))
const Login = loadable(() => import('../view/Login/loginPage'))

const Routes: React.FC = () => {

  let location = useLocation()
  return (
      <TransitionGroup className={'router-wrapper'}>
        <CSSTransition
          classNames={'fade'}
          appear={true}
          key={location.pathname}
          timeout={1500}
          unmountOnExit={true}
        >
          <Switch location={location}> 
            <Route path="/login" component={Login}></Route>
            <AuthorizedRoute path="/" component={Home} exact={true}></AuthorizedRoute>
            <AuthorizedRoute path="/create" component={Create}></AuthorizedRoute>
            <AuthorizedRoute path="/editArticle/:id" component={EditArticle}></AuthorizedRoute>
            <AuthorizedRoute path="/music" component={Music}></AuthorizedRoute>
            <AuthorizedRoute path="/background" component={Background}></AuthorizedRoute>
        </Switch>
        </CSSTransition>
      </TransitionGroup>
  );
}

export default withRouter(Routes);
