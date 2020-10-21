import React from 'react';
import "./App.scss"
import '@fortawesome/fontawesome-free/css/all.min.css';
import DialogContainer, {dialogStore} from "./components/dialogs/DialogContainer";
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import NavigationComponent from "./components/navbar/NavigationComponent";
import {Route} from "react-router";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HostPage from "./pages/host/HostPage";
import SettingsPage from "./pages/settings/SettingsPage";
import HelpPage from "./pages/help/HelpPage";
import LoadingIndicator from "./components/loader/LoadingIndicator";
import TopBarComponent from "./components/topbar/TopBarComponent";

const App = () =>
  // @ts-ignore
  <GlobalHooksProvider hooks={[dialogStore]}>
    <NavigationComponent className={"root__navigation"}/>
    <TopBarComponent className={"root__topbar"}/>
    <div className={"root_content"}>
      <Route exact path={"/"} component={DashboardPage}/>
      <Route exact path={"/hosts/:hostID"} component={HostPage}/>
      <Route exact path={"/settings"} component={SettingsPage}/>
      <Route exact path={"/help"} component={HelpPage}/>
    </div>
    <DialogContainer/>
  </GlobalHooksProvider>

export default withAuthenticationRequired(App, {
  onRedirecting: () => <LoadingIndicator/>,
});
