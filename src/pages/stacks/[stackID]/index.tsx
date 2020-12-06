import {StackContext} from "context/StackContext";
import StackLayout from "layouts/StackLayout";
import React, {useContext} from "react";
import StackNavigatorComponent from "widgets/navigator/StackNavigatorComponent";
import NetworkComponent from "widgets/network/NetworkComponent";

const StackPage = () =>
{
  const {state: {id}} = useContext(StackContext)
  return <NetworkComponent stackID={id}/>
}

StackPage.Navigator = <StackNavigatorComponent/>
StackPage.Layout = StackLayout;

// noinspection JSUnusedGlobalSymbols
export default StackPage;
