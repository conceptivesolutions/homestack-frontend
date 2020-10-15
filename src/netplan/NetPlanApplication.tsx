import NavigationComponent from "./components/navbar/NavigationComponent";
import NetworkComponent from "./components/network/NetworkComponent";
import DialogContainer from "./components/dialogs/DialogContainer";
import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Route} from "react-router";
import HomeDummy from "./components/home/HomeDummy";
import LoadingIndicator from "./components/loader/LoadingIndicator";

/**
 * Contains the whole application that requires a previous login
 */
const NetPlanApplication = () =>
{
  return (
    <>
      <NavigationComponent/>
      <Route exact path={"/"} component={HomeDummy}/>
      <Route exact path={"/hosts/:hostID"} component={NetworkComponent}/>
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
