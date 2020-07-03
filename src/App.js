import React from 'react';
import logo from './logo.svg';
import './App.css';
import PhaseContainer from './PhaseContainer';


function App() {  

  return (
    <div className="container">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <PhaseContainer logoDepth={400}/>
      </header>
    </div>
  );
}

export default App;
