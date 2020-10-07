import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavigationComponent from "./netplan/components/navbar/NavigationComponent";
import {NetworkComponent} from "./netplan/components/network/NetworkComponent";

export default function App()
{
  return (
    <React.Fragment>
      <NavigationComponent/>
      <NetworkComponent/>
    </React.Fragment>
  );
};
