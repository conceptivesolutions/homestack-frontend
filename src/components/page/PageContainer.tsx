import React, {useContext} from "react";
import styles from "./PageContainer.module.scss";
import NavBar from "../navbar/NavBar";
import NavBarItem, {INavBarItem} from "../navbar/NavBarItem";
import IconItem from "../navbar/items/IconItem";
import ProfileItem from "../navbar/items/ProfileItem";
import {useHistory, useLocation} from "react-router";
import {GlobalContext} from "../../state/GlobalContext";
import classNames from "classnames";
import ContextSwitcherEntry from "../contextswitcher/ContextSwitcherEntry";
import _ from "lodash";
import randomColor from "randomcolor";
import ContextSwitcher from "../contextswitcher/ContextSwitcher";
import {IHost} from "../../types/model";
import PopupItem from "../navbar/PopupItem";
import {useAuth0} from "@auth0/auth0-react";

export interface IPageContent
{
  navbarItems?: INavBarItem[],
  edge?: React.ReactNode,
  navigator?: React.ReactNode,
  children?: React.ReactNode,
}

export default (props: IPageContent) =>
{
  const {logout} = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const {state: {user, hosts}} = useContext(GlobalContext);

  return (
    <div className={classNames(styles.container, {[styles.container__withNavigator]: !!props.navigator})}>
      <ContextSwitcher className={styles.switcher}>
        {_createHostSwitcherEntries(hosts, location.pathname, hostID => history.push("/hosts/" + hostID))}
        <ContextSwitcherEntry alignment={"bottom"} iconName={"plus"} title={"Add System"}/>
      </ContextSwitcher>
      <NavBar className={styles.navbar}>
        {props.navbarItems?.map(pItem => <NavBarItem key={JSON.stringify(pItem.children)} {...pItem}/>)}
        <IconItem alignment={"right"} iconName={"cog"} active={history.location.pathname.startsWith("/settings")} onClick={() => history.push("/settings")}/>
        <IconItem alignment={"right"} iconName={"bell"}/>
        <ProfileItem alignment={"right"} iconSrc={user?.picture} popupItems={(<>
          <PopupItem iconName={"user"}>My Profile</PopupItem>
          <PopupItem iconName={"sign-out-alt"} separatorTop onClick={() => logout()}>Logout</PopupItem>
        </>)}/>
      </NavBar>
      <div className={styles.edge} onClick={() => history.push("/")}>
        {props.edge}
      </div>
      {<div className={styles.navigator}>
        {props.navigator}
      </div>}
      <div className={styles.content}>
        {props.children}
      </div>
    </div>
  );
}

/**
 * Creates the host entries for the switcher
 *
 * @param hosts current hosts
 * @param currentLocation current location
 * @param onClick function that gets executed on click
 */
function _createHostSwitcherEntries(hosts: IHost[] | undefined, currentLocation: string, onClick: (hostID: string) => void)
{
  return _.sortBy(hosts, ['displayName', 'id'])
    .map(pHost => <ContextSwitcherEntry key={pHost.id} alignment={"top"} iconName={"server"}
                                        title={pHost.displayName || ""}
                                        active={currentLocation.startsWith("/hosts/" + pHost.id)}
                                        iconColor={"white"}
                                        color={randomColor({
                                          hue: "blue",
                                          seed: pHost.id,
                                          luminosity: "bright"
                                        })}
                                        onClick={() => onClick(pHost.id)}/>)
}
