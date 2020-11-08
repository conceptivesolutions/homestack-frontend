import React, {useContext} from "react";
import HostNavigatorComponent from "../../../widgets/navigator/HostNavigatorComponent";
import {HostContext} from "../../../context/HostContext";
import NetworkComponent from "../../../widgets/network/NetworkComponent";
import HostLayout from "../../../layouts/HostLayout";

const HostPage = () =>
{
  const {state: {id}} = useContext(HostContext)
  return <NetworkComponent hostID={id}/>
}

HostPage.Navigator = <HostNavigatorComponent/>
HostPage.Layout = HostLayout;
export default HostPage;
