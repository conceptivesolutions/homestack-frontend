import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import {NavigationComponent} from "./netplan/components/navbar/NavigationComponent";
import {NetworkComponent} from "./netplan/components/network/NetworkComponent";

export default function App()
{
  const style = {
    margin: "0",
    paddingLeft: "240px",
    paddingTop: "0",
  };

  return (
    <Router>
      <div className="fixed-sn black-skin h-100">
        <NavigationComponent/>
        <main className={"w-100 h-100"} style={style}>
          <NetworkComponent/>
        </main>
      </div>
    </Router>
  );
};
