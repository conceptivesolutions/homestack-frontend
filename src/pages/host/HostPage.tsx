import React from "react";
import "./HostPage.scss";
import NetworkComponent from "./network/NetworkComponent";
import {useParams} from "react-router";
import NavigatorComponent from "./navigator/NavigatorComponent";
import PageContainer from "../../components/page/PageContainer";
import {HostProvider} from "./state/HostContext";

/**
 * Creates an "Host"-Page and loads the host with the ID from the url
 */
export default () =>
{
  const {hostID} = useParams();
  if (!hostID)
    return <></>;

  return <HostProvider id={hostID}>
    <PageContainer navigator={(<NavigatorComponent className={"host__navigator"}/>)}
                   navbarItems={[{
                     alignment: "left",
                     children: "View Network"
                   }, {
                     alignment: "left",
                     children: "Manage",
                     active: true,
                   }, {
                     alignment: "left",
                     children: "Devices"
                   }, {
                     alignment: "left",
                     children: "Settings"
                   }]}>
      <NetworkComponent hostID={hostID}/>
    </PageContainer>
  </HostProvider>
}
