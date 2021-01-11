import React from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes';
import Aside from './components/Aside'
import Header from './components/Header'

let globalReducer = (state:any, action:any) => {
  switch (action.type) {
    case 'handleLoginStatus':
      return {
        ...state,
        loginStatus: action.payload
      }
    case 'setToken':
      return {
        ...state,
        token: action.payload
      }
    default:
      return state
  }
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: any
  }
}

export const globalContext:any = React.createContext([])

const App: React.FC = () => {
  const globalState = {
    loginStatus: false,
    token: ''
  }

  const [ state, dispatch ] = React.useReducer(globalReducer, globalState)

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      <Router basename={window.__POWERED_BY_QIANKUN__ ? '/react16' : '/'}>
        <Aside />
        <Header />
        <div id="main">
          <Routes/>
        </div>
      </Router>
    </globalContext.Provider>
  );
}

export default App;
