import React, { Component } from 'react';
import { Route } from 'react-router-dom'; 
import './App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Requests from './requests';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Route path="/" component={Navbar} />
        <Route exact path="/" component={Main} />
      </div>
    );
  }
}

export default App;
