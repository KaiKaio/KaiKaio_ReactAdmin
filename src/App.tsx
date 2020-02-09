import React from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes';
import Aside from './components/Aside'
import Header from './components/Header'

const App: React.FC = () => {
  return (
    <Router>
      <Aside />
      <Header />
      <div id="main">
        <Routes/>
      </div>
    </Router>
  );
}

export default App;
