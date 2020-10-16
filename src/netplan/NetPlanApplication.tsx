import NavigationComponent from "./components/navbar/NavigationComponent";
import DialogContainer from "./components/dialogs/DialogContainer";
import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Route} from "react-router";
import HomeDummy from "./components/home/HomeDummy";
import LoadingIndicator from "./components/loader/LoadingIndicator";
import HostPage from "./pages/host/HostPage";

/**
 * Contains the whole application that requires a previous login
 */
const NetPlanApplication = () =>
{
  return (
    <>
      <NavigationComponent/>
      <Route exact path={"/"} component={HomeDummy}/>
      <Route exact path={"/hosts/:hostID"} component={HostPage}/>
      <Route exact path={"/settings"} component={HomeDummy}/>
      <Route exact path={"/help"} component={HomeDummy}/>
      <Route exact path={"/account"} component={HomeDummy}/>
      <DialogContainer/>
    </>
  )
}

export default withAuthenticationRequired(NetPlanApplication, {
  onRedirecting: () => <LoadingIndicator/>,
});
