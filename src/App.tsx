import React from 'react';
import { Route } from 'react-router';
import Home from './components/Home';
import Chat from './components/Chat';
import ScreenShare from './components/ScreenShare';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Route exact path="/" component={Home}></Route>
      <Route path="/chat" component={Chat}></Route>
      <Route path="/screen" component={ScreenShare}></Route>
    </div>
  );
};

export default App;
