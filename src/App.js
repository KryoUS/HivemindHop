import React, { Component } from 'react';
import router from './router';
import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';



class App extends Component {

  render() {
    return (
      <div className="App">
        <Nav />
        {router}
      </div>
    );
  }
}

export default App;
