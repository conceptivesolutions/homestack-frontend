import React, {useEffect, useState} from "react";
import './NavigationComponent.scss'
import NavigationItem from "./NavigationItem";
import {useAuth0} from "@auth0/auth0-react";
import {IHost} from "../../types/model";
import {getHosts} from "../../rest/HostClient";
import _ from "lodash";

/**
 * NavigationComponent
 *
 * @returns {JSX.Element}
 */
export default () =>
{
  const {user, logout, getAccessTokenSilently} = useAuth0();
  const [hosts, setHosts] = useState<IHost[]>([]);

  // Load hosts
  useEffect(() =>
  {
    getAccessTokenSilently()
      .then(pToken => getHosts(pToken))
      .then((pHosts) => setHosts(pHosts))
  }, [getAccessTokenSilently])

  return (
    <div className={"nav-container"}>
      <img className={"logo"} src={"/300_dark.png"} alt={"logo"}/>
      <NavigationItem linkTo={"/"} iconName={"home"} title={"Dashboard"}/>
      <NavigationItem iconName={"desktop"} title={"Hosts"} defaultOpen={true}>
        {_.sortBy(hosts, ['displayName', 'id'])
          .map(pHost => <NavigationItem key={pHost.id} linkTo={"/hosts/" + pHost.id} title={pHost.displayName || pHost.id}/>)}
      </NavigationItem>
      <NavigationItem linkTo={"/settings"} iconName={"cogs"} title={"Settings"}/>
      <NavigationItem linkTo={"/help"} iconName={"question-circle"} title={"Help"}/>
      <NavigationItem iconElement={<img alt="Avatar" className={"nav-icon nav-icon__profile"} src={user.picture}/>} title={user.nickname}>
        <NavigationItem title={"Logout"} onClick={() => logout()}/>
      </NavigationItem>
    </div>
  );
}
