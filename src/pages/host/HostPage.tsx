import React from "react";
import "./HostPage.scss";
import NetworkComponent from "./network/NetworkComponent";
import {useParams} from "react-router";
import {HostProvider} from "./state/HostContext";
import NavigatorComponent from "./navbar/NavigatorComponent";
import NavBar from "../../components/navbar/NavBar";
import NavBarItem from "../../components/navbar/NavBarItem";

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
        <NavBar className={"host__navbar"}>
          <NavBarItem alignment={"left"} title={"Dashboard"}/>
          <NavBarItem alignment={"left"} title={"Activity"} active/>
          <NavBarItem alignment={"left"} title={"Project Namespaces"}/>
          <NavBarItem alignment={"left"} title={"Teams"}/>
          <NavBarItem alignment={"left"} title={"Domains"}/>
        </NavBar>
        <div className={"host__edge"}/>
        <NavigatorComponent className={"host__navigator"}/>
        <div className={"host__network"}>
          <NetworkComponent hostID={hostID}/>
        </div>
      </div>
    </HostProvider>
  );
}
