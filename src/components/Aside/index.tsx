import * as React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import { Input, Icon, Button } from 'antd';

import { globalContext } from '../../App'

import './index.scss'

const Aside: React.FC = () => {
  const location:any = useLocation()

  const GlobalContext:any = React.useContext(globalContext)

  const [userName, setUserName] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [ nav ] = React.useState([
    { name: '新建文章', path: '/create' },
    { name: '文章管理', path: '/' },
    { name: '音乐管理', path: '/music' },
    { name: '背景管理', path: '/background' }
  ]);
  
  let renderNav = nav.map((item) => {
    return <Link 
      to={item.path} 
      className={ location.pathname === item.path ? 'nav-item active' : 'nav-item' }
      key={item.name}>{ item.name }</Link>
  })

  let handleLogin = () => {
    console.log(GlobalContext)
    GlobalContext.dispatch({ type: 'handleLoginStatus', payload: true})
  }

  let handlelogout = () => {
    GlobalContext.dispatch({ type: 'handleLoginStatus', payload: false})
  }

  return (
    
    <div id="aside">
      <div className="logo">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-cat"></use>
        </svg>
        <span>KaiKaio</span>
      </div>

      <CSSTransition
        classNames="btn"
        timeout={1500}
        in={GlobalContext.state.loginStatus}
        unmountOnExit={true}
      >
      
        <div className="nav-wrapper">
          { renderNav }
          <div
            onClick={() => {handlelogout()}}
            className={'nav-item'}>
              注销登录
          </div>
        </div>

      </CSSTransition>

      <CSSTransition
        classNames="btn"
        timeout={1500}
        in={!GlobalContext.state.loginStatus}
        unmountOnExit={true}
      >
        <div className="login-wrapper">
          <Input
            onChange={(e) => {setUserName(e.target.value)}} 
            placeholder="请输入你的账号"
            prefix={<Icon type="user" />}
          />
          <Input.Password
          onChange={(e) => {setPassword(e.target.value)}} 
            placeholder="请输入你的密码"
            prefix={<Icon type="lock" />}
          />

        <Button
          className="submit-bottom"
          type="primary"
          onClick={() => {handleLogin()}}
        >登录</Button>

        </div>
      </CSSTransition>
    </div>
  );
}

export default Aside