import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {dialogStore} from "./netplan/components/dialogs/DialogContainer";
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import {Auth0Provider} from "@auth0/auth0-react";
import {BrowserRouter} from "react-router-dom";
import NetPlanApplication from "./netplan/NetPlanApplication";
import Config from "./netplan/helpers/Config";

export default function App()
{
  return (
    <BrowserRouter>
      <Auth0Provider domain={Config.auth.DOMAIN} clientId={Config.auth.CLIENTID} audience={Config.auth.APIID} redirectUri={window.location.origin}>
        {/* @ts-ignore */}
        <GlobalHooksProvider hooks={[dialogStore]}>
          <NetPlanApplication/>
        </GlobalHooksProvider>
      </Auth0Provider>
    </BrowserRouter>
  );
};
