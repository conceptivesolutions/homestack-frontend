import {StackContext} from "context/StackContext";
import React, {useContext} from "react";
import HostLayout from "../../../layouts/HostLayout";
import HostNavigatorComponent from "../../../widgets/navigator/HostNavigatorComponent";
import NetworkComponent from "../../../widgets/network/NetworkComponent";

const HostPage = () =>
{
  const {state: {id}} = useContext(StackContext)
  return <NetworkComponent hostID={id}/>
}

HostPage.Navigator = <HostNavigatorComponent/>
HostPage.Layout = HostLayout;
export default HostPage;
