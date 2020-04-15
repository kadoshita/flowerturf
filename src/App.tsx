import React from 'react';
import { Route } from 'react-router';
import Home from './Home';
import Chat from './Chat';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Route exact path="/" component={Home}></Route>
      <Route path="/chat" component={Chat}></Route>
    </div>
  );
};

export default App;
