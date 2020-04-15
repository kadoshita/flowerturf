import React from 'react';
import { Route } from 'react-router';
import Home from './Home';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Route exact path="/" component={Home}></Route>
    </div>
  );
};

export default App;
