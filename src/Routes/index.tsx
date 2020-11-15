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

let reducer = (state:Object, action:{type:string, payload:any}) => {
  switch (action.type) {
    case 'changeLoginStatus':
      return {
        ...state,
        loginStatus: action.payload
      }
    default:
      return state
  }
}
// 定义 context函数
export const globalContext = React.createContext({})

const Routes: React.FC = () => {

  // 定义初始化值
  const globalState = {
    loginStatus: false
  }

  const [ state, dispatch ] = React.useReducer(reducer, globalState)

  let location = useLocation()
  return (
    <globalContext.Provider value={{ state, dispatch }}>
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
            <AuthorizedRoute path="/" component={Home}></AuthorizedRoute>
            <AuthorizedRoute path="/create" component={Create}></AuthorizedRoute>
            <AuthorizedRoute path="/editArticle/:id" component={EditArticle}></AuthorizedRoute>
            <AuthorizedRoute path="/music" component={Music}></AuthorizedRoute>
            <AuthorizedRoute path="/background" component={Background}></AuthorizedRoute>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </globalContext.Provider>
  );
}

export default withRouter(Routes);
