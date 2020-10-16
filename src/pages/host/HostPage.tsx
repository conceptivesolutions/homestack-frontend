import React from "react";
import NetworkComponent from "./NetworkComponent";
import {useParams} from "react-router";

/**
 * Creates an "Host"-Page and loads the host with the ID from the url
 */
export default () =>
{
  const {hostID} = useParams();
  if (!hostID)
    return <></>;
  return <NetworkComponent hostID={hostID}/>;
}
