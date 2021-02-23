import React, {
  useEffect,
  FC,
  createContext,
  HTMLAttributes,
  useReducer,
} from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/Routes';
import Aside from 'src/components/Aside';
import Header from 'src/components/Header';
import axios from 'src/config/fetchInstance';

const globalReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'handleLoginStatus':
      return {
        ...state,
        loginStatus: action.payload,
      };
    case 'setToken':
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

interface IProps extends HTMLAttributes<HTMLAnchorElement> {
  mainAppInfo: {
    container: HTMLElement;
    onGlobalStateChange: any;
  };
}

export const globalContext: any = createContext([]);

const App: FC<IProps> = ({ mainAppInfo }: IProps) => {
  const globalState = {
    loginStatus: false,
    token: '',
  };

  const [state, dispatch] = useReducer(globalReducer, globalState);

  const listenSetToken = ({ data: { method, token } }: any) => {
    if (method === 'setToken') {
      localStorage.setItem('token', token);
      window.parent.postMessage(
        {
          msg: 'token received',
        },
        'https://sso.kaikaio.com/',
      );
    }
  };

  useEffect(() => {
    if (mainAppInfo.container) {
      // 基座内运行时
      mainAppInfo.onGlobalStateChange((value: string) => {
        axios.defaults.headers.common.Authorization = `Bearer ${value}`;
        dispatch({ type: 'setToken', payload: value });
        dispatch({ type: 'handleLoginStatus', payload: true });
      }, true);
      return;
    }

    // 独立运行时
    window.addEventListener('message', listenSetToken, false);

    axios.defaults.headers.common.Authorization = `Bearer ${
      localStorage.token || ''
    }`;
    axios
      .get('/user/verifyToken')
      .then(() => {
        dispatch({ type: 'setToken', payload: localStorage.token });
        dispatch({ type: 'handleLoginStatus', payload: true });
        window.removeEventListener('message', listenSetToken);
      })
      .catch((err) => {
        console.error(err, ' => 登录失败');
      });

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('message', listenSetToken);
    };
  }, []);

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      <Router basename={window.__POWERED_BY_QIANKUN__ ? '/react16' : '/'}>
        <Aside />
        <Header />
        <div id="main">
          <Routes />
        </div>
      </Router>
    </globalContext.Provider>
  );
};

export default App;
