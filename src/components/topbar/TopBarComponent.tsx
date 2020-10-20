import React, {useEffect, useState} from "react";
import "./TopBarComponent.scss"
import TopBarItem from "./TopBarItem";
import {useAuth0} from "@auth0/auth0-react";
import {IHost} from "../../types/model";
import {getHosts} from "../../rest/HostClient";
import _ from "lodash";

/**
 * Component for the upper navigation bar
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
    <div className={"topbar__container"}>
      <img className={"topbar__logo"} src={"/300_dark.png"} alt={"logo"}/>
      <div className={"topbar__entries-container"}>
        <TopBarItem id={"home"} linkTo={"/"} iconName={"home"} title={"Dashboard"}/>
        <TopBarItem id={"hosts"} iconName={"desktop"} title={"Hosts"} items={_.sortBy(hosts, ['displayName', 'id'])
          .map(pHost => ({
            id: "host__" + pHost.id,
            title: pHost.displayName || pHost.id,
            linkTo: "/hosts/" + pHost.id,
          }))}/>
        <TopBarItem id={"settings"} linkTo={"/settings"} iconName={"cogs"} title={"Settings"}/>
        <TopBarItem id={"help"} linkTo={"/help"} iconName={"question-circle"} title={"Help"}/>
      </div>
      <TopBarItem id={"avatar"} title={user.nickname} iconElement={<img className={"topbar-item__icon"} src={user.picture} alt="Avatar"/>} items={[{
        id: "logout",
        title: "Logout",
        onClick: () => logout(),
      }]}/>
    </div>
  )
    ;
}
