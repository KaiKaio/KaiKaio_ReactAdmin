import * as React from 'react';
import { Link } from 'react-router-dom'

import { useLocation } from 'react-router-dom';

import './index.scss'

const Aside: React.FC = () => {
  const location:any = useLocation()
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

  return (

    <div id="aside">
      <div className="logo">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#icon-cat"></use>
        </svg>
        <span>KaiKaio</span>
      </div>
      
      { renderNav }
    </div>
  );
}

export default Aside