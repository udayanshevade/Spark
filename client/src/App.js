import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import '../node_modules/grommet-css'; 
import './App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';

class App extends Component {
  render() {
    return (
      <div className="grommet grommetux-app">
        <Route path="/" component={Navbar} />
        <Route exact path="/" component={Main} />
      </div>
    );
  }
}

export default App;
