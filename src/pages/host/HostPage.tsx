import React from "react";
import "./HostPage.scss";
import NetworkComponent from "./network/NetworkComponent";
import {useParams} from "react-router";
import NavigationComponent from "./navbar/NavigationComponent";
import {HostProvider} from "./state/HostContext";

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
        <NavigationComponent className={"host__navigation"}/>
        <NetworkComponent className={"host__network"} hostID={hostID}/>
      </div>
    </HostProvider>
  );
}
