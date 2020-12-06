import {StackContext} from "context/StackContext";
import StackLayout from "layouts/StackLayout";
import React, {useContext} from "react";
import HostNavigatorComponent from "../../../widgets/navigator/HostNavigatorComponent";
import NetworkComponent from "../../../widgets/network/NetworkComponent";

const HostPage = () =>
{
  const {state: {id}} = useContext(StackContext)
  return <NetworkComponent hostID={id}/>
}

HostPage.Navigator = <HostNavigatorComponent/>
HostPage.Layout = StackLayout;
export default HostPage;
