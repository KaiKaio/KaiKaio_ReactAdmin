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

export interface GlobalState {
  loginStatus: boolean;
  token: string;
}

export type GlobalAction =
  | { type: 'handleLoginStatus'; payload: boolean }
  | { type: 'setToken'; payload: string };

export interface GlobalContextType {
  state: GlobalState;
  dispatch: React.Dispatch<GlobalAction>;
}

const globalReducer = (state: GlobalState, action: GlobalAction): GlobalState => {
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

export const globalContext = createContext<GlobalContextType>({} as GlobalContextType);

const App: FC<IProps> = ({ mainAppInfo }: IProps) => {
  const [initializing, setInitializing] = useState(true);

  // 最小loading时长，防止初始化太快导致闪动
  const MIN_LOADING_TIME = 500;
  const loadingStartRef = React.useRef<number>(Date.now());

  const globalState: GlobalState = {
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
    const finishInitializing = () => {
      const elapsed = Date.now() - loadingStartRef.current;
      const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
      window.setTimeout(() => {
        setInitializing(false);
      }, delay);
    };

    if (mainAppInfo?.container) {
      // 基座内运行时
      mainAppInfo.onGlobalStateChange((value: string) => {
        axios.defaults.headers.common.Authorization = `Bearer ${value}`;
        billService.defaults.headers.common.Authorization = `${value}`;
        dispatch({ type: 'setToken', payload: value });
        dispatch({ type: 'handleLoginStatus', payload: true });
        finishInitializing();
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
        finishInitializing();
      });

    // // TODO 临时使用
    // dispatch({ type: 'setToken', payload: localStorage.token });
    // dispatch({ type: 'handleLoginStatus', payload: true });
    // window.removeEventListener('message', listenSetToken);

     
    return () => {
      window.removeEventListener('message', listenSetToken);
    };
  }, []);

  if (initializing) {
    return (
      <div className="app-loading">
        <div className="loader">
          <div className="dot" />
          <div className="dot" />
          <div className="dot" />
        </div>
        <div className="loading-text">
          Welcome Kaikaio Admin
        </div>
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
