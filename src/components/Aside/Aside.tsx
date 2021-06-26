import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Button } from 'antd';

import axios from 'src/config/fetchInstance';

import { globalContext } from 'src/App';

import './index.scss';

const Aside: React.FC = () => {
  const location: any = useLocation();

  const GlobalContext: any = React.useContext(globalContext);

  const [nav] = React.useState([
    { name: '新建文章', path: '/create' },
    { name: '文章管理', path: '/' },
    { name: '音乐管理', path: '/music' },
    { name: '背景管理', path: '/background' },
  ]);

  const renderNav = nav.map(item => (
    <Link
      to={item.path}
      className={
        location.pathname === item.path ? 'nav-item active' : 'nav-item'
      }
      key={item.name}
    >
      {item.name}
    </Link>
  ));
  const handlelogout = () => {
    axios.defaults.headers.common.Authorization = '';
    GlobalContext.dispatch({ type: 'setToken', payload: '' });
    GlobalContext.dispatch({ type: 'handleLoginStatus', payload: false });
  };

  return (
    <div id="aside">
      <div className="logo">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-cat" />
        </svg>
        <span>KaiKaio</span>
      </div>

      <CSSTransition
        classNames="btn"
        timeout={1500}
        in={GlobalContext.state.loginStatus}
        unmountOnExit
      >
        <div className="nav-wrapper">
          {renderNav}
          <div
            aria-hidden="true"
            onClick={() => {
              handlelogout();
            }}
            className="nav-item"
          >
            注销登录
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        classNames="btn"
        timeout={1500}
        in={!GlobalContext.state.loginStatus}
        unmountOnExit
      >
        <div className="login-wrapper">
          <Button
            className="submit-bottom"
            type="primary"
          >
            <a href="https://sso.kaikaio.com/">登录</a>
          </Button>
        </div>
      </CSSTransition>
    </div>
  );
};

export default Aside;
