import {StackContext} from "context/StackContext";
import StackLayout from "layouts/StackLayout";
import React, {useContext} from "react";
import HostNavigatorComponent from "widgets/navigator/HostNavigatorComponent";
import NetworkComponent from "widgets/network/NetworkComponent";

const StackPage = () =>
{
  const {state: {id}} = useContext(StackContext)
  return <NetworkComponent hostID={id}/>
}

StackPage.Navigator = <HostNavigatorComponent/>
StackPage.Layout = StackLayout;

// noinspection JSUnusedGlobalSymbols
export default StackPage;
