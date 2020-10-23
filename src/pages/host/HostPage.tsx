import React from "react";
import "./HostPage.scss";
import NetworkComponent from "./network/NetworkComponent";
import {useParams} from "react-router";
import {HostProvider} from "./state/HostContext";
import NavigatorComponent from "./navbar/NavigatorComponent";

/**
 * Creates an "Host"-Page and loads the host with the ID from the url
 */
export default () =>
{
  const {hostID} = useParams();
  if (!hostID)
    return <></>;
  return (
    <HostProvider id={hostID}>
      <div className={"host__container"}>
        <NavigatorComponent className={"host__navigator"}/>
        <NetworkComponent className={"host__network"} hostID={hostID}/>
      </div>
    </HostProvider>
  );
}
