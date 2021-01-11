import * as React from 'react';
import { Link, useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group';
import { Input, Icon, Button } from 'antd'

import axios from 'src/config/axios';
import {AxiosResponse} from 'axios';

import { PUB_KEY } from '../../config/certKey'

import { globalContext } from '../../App'

import './index.scss'

const JSEncrypt = require('jsencrypt');

const Aside: React.FC = () => {
  const location:any = useLocation()

  const GlobalContext:any = React.useContext(globalContext)

  const [userName, setUserName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loginTipShow, setLoginTipShow] = React.useState(false)

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
    const JSEncryptCus = JSEncrypt.JSEncrypt;
    const encrypt = new JSEncryptCus();
    encrypt.setPublicKey(PUB_KEY);
    axios.post('/user/login', {
      userName,
      password: encrypt.encrypt(password)
    }).then((res:AxiosResponse) => {
      const { token, code } = res?.data
      setUserName('')
      setPassword('')
      if(code === 0) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        GlobalContext.dispatch({ type: 'setToken', payload: token})
        GlobalContext.dispatch({ type: 'handleLoginStatus', payload: true})
      }
    }).catch(err => {
      setLoginTipShow(true)
      console.log(err, '登录错误日志')
    })
  }

  let handlelogout = () => {
    axios.defaults.headers.common['Authorization'] = ''
    GlobalContext.dispatch({ type: 'setToken', payload: ''})
    GlobalContext.dispatch({ type: 'handleLoginStatus', payload: false})
  }

  const loginTip = (): React.CSSProperties => (
    loginTipShow ? {opacity: 1} : {opacity: 0}
  )

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
          <div className="login-tip" style={loginTip()}>
            用户名或密码错误，请重新登录
          </div>
          <Input
            value={userName}
            onChange={
              (e) => {
                setUserName(e.target.value)
                setLoginTipShow(false)
              }
            } 
            placeholder="请输入你的账号"
            prefix={<Icon type="user" />}
          />
          <Input.Password
            onChange={
              (e) => {
                setPassword(e.target.value)
                setLoginTipShow(false)
              } 
            }
            value={password}
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