import React from 'react';
import {NetworkComponent} from './netplan/components/network/NetworkComponent';
import {MenubarComponent} from './netplan/components/topbar/MenubarComponent';
import './App.css';

export default function App() {
  return (
    <div className="App">
      <MenubarComponent/>
      <NetworkComponent/>
    </div>
  );
};
