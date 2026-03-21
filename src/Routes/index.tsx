import React from 'react';
import {
  useLocation, Route, Routes,
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import loadable from 'src/utils/loadable';

// import AuthorizedRoute from 'src/Routes/components/AuthorizedRoute';

const Home = loadable(() => import('../view/Home'));
const Create = loadable(() => import('../view/Create'));
const Music = loadable(() => import('../view/Music'));
const EditArticle = loadable(() => import('../view/EditArticle'));
const Background = loadable(() => import('../view/Background'));
const Login = loadable(() => import('../view/Login/loginPage'));
const BillChart = loadable(() => import('../view/BillChart/BillChart'));
const Bookkeeping = loadable(() => import('../view/Bookkeeping'));

const TransitionWrapper: React.FC<any> = ({ children, ...props }) => {
  const nodeRef = React.useRef(null);
  return (
    <CSSTransition {...props} nodeRef={nodeRef}>
      <div ref={nodeRef} className="route-transition-node">
        {children}
      </div>
    </CSSTransition>
  );
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <TransitionGroup className="router-wrapper">
      <TransitionWrapper
        classNames="fade"
        appear
        key={location.pathname}
        timeout={1500}
        unmountOnExit
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/editArticle/:id" element={<EditArticle />} />
          <Route path="/music" element={<Music />} />
          <Route path="/background" element={<Background />} />
          <Route path="/Bill-chart" element={<BillChart />} />
          <Route path="/bookkeeping" element={<Bookkeeping />} />
        </Routes>
      </TransitionWrapper>
    </TransitionGroup>
  );
};

export default AppRoutes;
