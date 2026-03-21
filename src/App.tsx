import React, {
  useEffect,
  FC,
  createContext,
  HTMLAttributes,
  useReducer,
  useState,
} from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from 'src/Routes';
import Aside from 'src/components/Aside';
import Header from 'src/components/Header';
import axios from 'src/config/fetchInstance';
import billService from 'src/config/BillService';

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
  mainAppInfo?: any;
}

export const globalContext: any = createContext([]);

const App: FC<IProps> = ({ mainAppInfo }: IProps) => {
  const [initializing, setInitializing] = useState(true);

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
        import.meta.env.VITE_SSO_URL || '/',
      );
    }
  };

  useEffect(() => {
    if (mainAppInfo?.container) {
      // 基座内运行时
      mainAppInfo.onGlobalStateChange((value: string) => {
        axios.defaults.headers.common.Authorization = `Bearer ${value}`;
        billService.defaults.headers.common.Authorization = `${value}`;
        dispatch({ type: 'setToken', payload: value });
        dispatch({ type: 'handleLoginStatus', payload: true });
        setInitializing(false);
      }, true);
      return;
    }

    // 独立运行时
    window.addEventListener('message', listenSetToken, false);

    axios.defaults.headers.common.Authorization = `Bearer ${
      localStorage.token || ''
    }`;
    billService.defaults.headers.common.Authorization = `${
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
      })
      .finally(() => {
        setInitializing(false);
      });

    // // TODO 临时使用
    // dispatch({ type: 'setToken', payload: localStorage.token });
    // dispatch({ type: 'handleLoginStatus', payload: true });
    // window.removeEventListener('message', listenSetToken);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('message', listenSetToken);
    };
  }, []);

  if (initializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
      >
        Loading...
      </div>
    );
  }

  return (
    <globalContext.Provider value={{ state, dispatch }}>
      <Router>
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
