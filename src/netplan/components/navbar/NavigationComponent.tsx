import React from "react";
import './NavigationComponent.scss'
import NavigationItem from "./NavigationItem";
import {useAuth0} from "@auth0/auth0-react";

/**
 * NavigationComponent
 *
 * @returns {JSX.Element}
 */
export default () =>
{
  const {user, logout} = useAuth0();
  return (
    <div className={"nav-container"}>
      <img className={"logo"} src={"/300_dark.png"} alt={"logo"}/>
      <NavigationItem linkTo={"/"} iconName={"home"} title={"Dashboard"}/>
      <NavigationItem iconName={"desktop"} title={"Hosts"} defaultOpen={true}>
        <NavigationItem linkTo={"/hosts/server1"} title={"Server 172.16.16.1"}/>
        <NavigationItem linkTo={"/hosts/server2"} title={"Server home.lan"}/>
        <NavigationItem linkTo={"/hosts/server3"} title={"Server 192.168.128.129"}/>
      </NavigationItem>
      <NavigationItem linkTo={"/settings"} iconName={"cogs"} title={"Settings"}/>
      <NavigationItem linkTo={"/help"} iconName={"question-circle"} title={"Help"}/>
      <NavigationItem iconElement={<img alt="Avatar" className={"nav-icon nav-icon__profile"} src={user.picture}/>} title={user.nickname}>
        <NavigationItem title={"Logout"} onClick={() => logout()}/>
      </NavigationItem>
    </div>
  );
}
