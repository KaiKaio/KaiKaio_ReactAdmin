import React from 'react';
import { useLocation, Route, Switch, withRouter } from 'react-router-dom';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Home from '../view/Home'
import Create from '../view/Create'
import Music from '../view/Music'
import EditArticle from '../view/EditArticle'
import Background from '../view/Background'

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
          <Route path="/" exact component={Home}></Route>
          <Route path="/create" component={Create}></Route>
          <Route path="/editArticle/:id" component={EditArticle}></Route>
          <Route path="/music" component={Music}></Route>
          <Route path="/background" component={Background}></Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default withRouter(Routes);
