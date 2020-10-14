import NavigationComponent from "./components/navbar/NavigationComponent";
import NetworkComponent from "./components/network/NetworkComponent";
import DialogContainer from "./components/dialogs/DialogContainer";
import React from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";

/**
 * Contains the whole application that requires a previous login
 */
const NetPlanApplication = () =>
{
  return (
    <>
      <NavigationComponent/>
      <NetworkComponent/>
      <DialogContainer/>
    </>
  )
}

export default withAuthenticationRequired(NetPlanApplication, {
  onRedirecting: () => <span>Loading...</span>, //todo
});
