import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import Config from "./helpers/Config";
import {GlobalProvider} from "./state/GlobalContext";

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider domain={Config.auth.DOMAIN} clientId={Config.auth.CLIENTID} audience={Config.auth.APIID}
                   cacheLocation={"localstorage"} redirectUri={window.location.origin}>
      <GlobalProvider>
        <App/>
      </GlobalProvider>
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
