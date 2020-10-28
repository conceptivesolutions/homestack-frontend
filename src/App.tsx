import React from 'react';
import "./App.scss"
import '@fortawesome/fontawesome-free/css/all.min.css';
import DialogContainer, {dialogStore} from "./components/dialogs/DialogContainer";
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Route, Switch} from "react-router";
import HostPage from "./pages/host/HostPage";
import SettingsPage from "./pages/settings/SettingsPage";
import HelpPage from "./pages/help/HelpPage";
import LoadingIndicator from "./components/loader/LoadingIndicator";
import HomePage from "./pages/home/HomePage";

const App = () =>
{
  return (
    // @ts-ignore
    <GlobalHooksProvider hooks={[dialogStore]}>
      <Switch>
        <Route exact path={"/hosts/:hostID"} component={HostPage}/>
        <Route exact path={"/settings"} component={SettingsPage}/>
        <Route exact path={"/help"} component={HelpPage}/>
        <Route path={"/"} component={HomePage}/>
      </Switch>
      <DialogContainer/>
    </GlobalHooksProvider>
  );
}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <LoadingIndicator/>,
});
