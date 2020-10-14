import React, {useState} from "react";
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
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selection, setSelection] = useState<string>("")
  const {user, logout} = useAuth0();
  const fOnClick = (name: string) => () => setOpenItems(openItems.includes(name) ? openItems.filter(pI => pI !== name) : [...openItems, name])
  return (
    <div className={"nav-container"}>
      <img className={"logo"} src={"300.png"} alt={"logo"}/>
      <NavigationItem iconName={"desktop"} title={"Hosts"} open={openItems.includes("hosts")} onClick={fOnClick("hosts")}>
        <NavigationItem title={"Server 172.16.16.1"} selected={selection === "dummy1"} onClick={() => setSelection("dummy1")}/>
        <NavigationItem title={"Server home.lan"} selected={selection === "dummy2"} onClick={() => setSelection("dummy2")}/>
        <NavigationItem title={"Server 192.168.128.129"} selected={selection === "dummy3"} onClick={() => setSelection("dummy3")}/>
      </NavigationItem>
      <NavigationItem iconName={"cogs"} title={"Settings"} selected={selection === "settings"} onClick={() => setSelection("settings")}/>
      <NavigationItem iconName={"question-circle"} title={"Help"} open={openItems.includes("help")} onClick={fOnClick("help")}/>
      <NavigationItem iconElement={<img alt="Avatar" className={"nav-icon nav-icon__profile"} src={user.picture}/>} title={user.nickname}
                      open={openItems.includes("account")} onClick={fOnClick("account")}>
        <NavigationItem title={"Logout"} onClick={() => logout()}/>
      </NavigationItem>
    </div>
  );
}
