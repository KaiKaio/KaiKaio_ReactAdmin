import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

import axios from 'src/config/fetchInstance';
import billService from 'src/config/BillService';

import { globalContext } from 'src/App';

import './index.scss';

const Aside: React.FC = () => {
  const REACT_SSO_URL = import.meta.env.VITE_SSO_URL || '/';
  const location: any = useLocation();

  const GlobalContext = React.useContext(globalContext);

  const navRef = React.useRef(null);
  const loginRef = React.useRef(null);

  const [nav] = React.useState([
    { name: '新建文章', path: '/create' },
    { name: '文章管理', path: '/' },
    { name: '音乐管理', path: '/music' },
    { name: '背景管理', path: '/background' },
    { name: '记账', path: '/bookkeeping' },
    { name: '账单统计', path: '/bill-chart' },
  ]);

  // 移动端抽屉菜单状态
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const renderNav = nav.map(item => (
    <Link
      to={item.path}
      className={
        location.pathname === item.path ? 'nav-item active' : 'nav-item'
      }
      key={item.name}
      onClick={() => setDrawerVisible(false)} // 点击导航项后关闭抽屉
    >
      {item.name}
    </Link>
  ));
  
  const handlelogout = () => {
    axios.defaults.headers.common.Authorization = '';
    billService.defaults.headers.common.Authorization = '';
    GlobalContext.dispatch({ type: 'setToken', payload: '' });
    GlobalContext.dispatch({ type: 'handleLoginStatus', payload: false });
    setDrawerVisible(false);
  };

  // 移动端汉堡菜单按钮
  const renderMobileMenu = () => (
    <div className="mobile-menu-trigger" onClick={() => setDrawerVisible(true)}>
      <MenuOutlined />
    </div>
  );

  // 导航内容（复用）
  const renderNavContent = () => (
    <>
      <div className="logo">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-cat" />
        </svg>
        <span>
          KaiKaio
        </span>
      </div>

      <CSSTransition
        classNames="btn"
        timeout={1500}
        in={GlobalContext.state.loginStatus}
        unmountOnExit
        nodeRef={navRef}
      >
        <div className="nav-wrapper" ref={navRef}>
          {renderNav}
          <div
            aria-hidden="true"
            onClick={handlelogout}
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
        nodeRef={loginRef}
      >
        <div className="login-wrapper" ref={loginRef}>
          <Button className="submit-bottom" type="primary">
            <a href={REACT_SSO_URL}>
              登录
            </a>
          </Button>
        </div>
      </CSSTransition>
    </>
  );

  return (
    <>
      {/* 移动端汉堡菜单 */}
      {renderMobileMenu()}
      
      {/* 桌面端侧边栏 */}
      <div id="aside" className="desktop-aside">
        {renderNavContent()}
      </div>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="mobile-drawer"
        size={280}
      >
        <div id="aside" className="drawer-content">
          {renderNavContent()}
        </div>
      </Drawer>
    </>
  );
};

export default Aside;
