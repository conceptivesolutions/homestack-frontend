import React from "react";
import "./HostPage.scss";
import NetworkComponent from "./network/NetworkComponent";
import {useParams} from "react-router";
import {HostProvider} from "./state/HostContext";
import NavigatorComponent from "./navbar/NavigatorComponent";
import NavBar from "../../components/navbar/NavBar";
import NavBarItem from "../../components/navbar/NavBarItem";
import {useAuth0} from "@auth0/auth0-react";
import ProfileItem from "../../components/navbar/items/ProfileItem";
import IconItem from "../../components/navbar/items/IconItem";

/**
 * Creates an "Host"-Page and loads the host with the ID from the url
 */
export default () =>
{
  const {hostID} = useParams();
  const {user} = useAuth0();
  if (!hostID)
    return <></>;
  return (
    <HostProvider id={hostID}>
      <div className={"host__container"}>
        <NavBar className={"host__navbar"}>
          <NavBarItem alignment={"left"}>Dashboard</NavBarItem>
          <NavBarItem alignment={"left"}>Activity</NavBarItem>
          <NavBarItem alignment={"left"}>Project Namespaces</NavBarItem>
          <NavBarItem alignment={"left"}>Teams</NavBarItem>
          <NavBarItem alignment={"left"}>Domains</NavBarItem>
          <IconItem alignment={"right"} iconName={"bell"}/>
          <ProfileItem alignment={"right"} iconSrc={user.picture}/>
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
