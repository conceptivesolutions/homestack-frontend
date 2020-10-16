import NavigationComponent from "./components/navbar/NavigationComponent";
import DialogContainer from "./components/dialogs/DialogContainer";
import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Route} from "react-router";
import LoadingIndicator from "./components/loader/LoadingIndicator";
import HostPage from "./pages/host/HostPage";
import SettingsPage from "./pages/settings/SettingsPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import HelpPage from "./pages/help/HelpPage";

/**
 * Contains the whole application that requires a previous login
 */
const NetPlanApplication = () =>
{
  return (
    <>
      <NavigationComponent/>
      <Route exact path={"/"} component={DashboardPage}/>
      <Route exact path={"/hosts/:hostID"} component={HostPage}/>
      <Route exact path={"/settings"} component={SettingsPage}/>
      <Route exact path={"/help"} component={HelpPage}/>
      <DialogContainer/>
    </>
  )
}

export default withAuthenticationRequired(NetPlanApplication, {
  onRedirecting: () => <LoadingIndicator/>,
});
