import React, {useContext} from "react";
import styles from "./PageContainer.module.scss";
import NavBar from "../navbar/NavBar";
import NavBarItem, {INavBarItem} from "../navbar/NavBarItem";
import ProfileItem from "../navbar/items/ProfileItem";
import {GlobalContext} from "../../context/GlobalContext";
import classNames from "classnames";
import ContextSwitcherEntry from "../contextswitcher/ContextSwitcherEntry";
import _ from "lodash";
import randomColor from "randomcolor";
import ContextSwitcher from "../contextswitcher/ContextSwitcher";
import {IHost} from "../../types/model";
import PopupItem from "../navbar/PopupItem";
import {useRouter} from "next/router";
import {AuthContext} from "../../context/AuthContext";
import md5 from "md5";
import {mdiAccount, mdiBellOutline, mdiCogOutline, mdiHomeOutline, mdiLaptop, mdiLogout} from "@mdi/js";
import ContextSwitcherEntryHeader from "../contextswitcher/ContextSwitcherEntryHeader";

export interface IPageContent
{
  navbarItems?: INavBarItem[],
  edge?: React.ReactNode,
  navigator?: React.ReactNode,
  children?: React.ReactNode,
}

const PageContainer = (props: IPageContent) =>
{
  const router = useRouter();
  const {state: {hosts}} = useContext(GlobalContext);
  const {state: {user, logout}} = useContext(AuthContext);

  return (
    <div className={classNames(styles.container, {[styles.container__withNavigator]: !!props.navigator})}>
      <ContextSwitcher className={styles.switcher}>
        <ContextSwitcherEntryHeader alignment={"top"} title={"Main"}/>
        <ContextSwitcherEntry alignment={"top"} title={"Dashboard"} icon={mdiHomeOutline} color={"#14bae4"}/>
        <ContextSwitcherEntryHeader alignment={"top"} title={"Hosts"}/>
        {_createHostSwitcherEntries(hosts, router.query.hostID as string || "", hostID => router.push("/hosts/" + hostID))}
      </ContextSwitcher>
      <NavBar className={styles.navbar}>
        {props.navbarItems?.map(pItem => <NavBarItem key={md5(JSON.stringify(pItem))} {...pItem}/>)}
        <NavBarItem icon={mdiCogOutline} alignment={"right"} active={router.pathname.startsWith("/settings")} onClick={() => router.push("/settings")}/>
        <NavBarItem icon={mdiBellOutline} alignment={"right"}/>
        <ProfileItem alignment={"right"} iconSrc={user?.picture} popupItems={(<>
          <PopupItem icon={mdiAccount}>My Profile</PopupItem>
          <PopupItem icon={mdiLogout} separatorTop onClick={() => logout()}>Logout</PopupItem>
        </>)}/>
      </NavBar>
      <div className={styles.edge} onClick={() => router.push("/")}>
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
};

export default PageContainer;

/**
 * Creates the host entries for the switcher
 *
 * @param hosts current hosts
 * @param hostID ID of the currently selected host
 * @param onClick function that gets executed on click
 */
function _createHostSwitcherEntries(hosts: IHost[] | undefined, hostID: string, onClick: (hostID: string) => void)
{
  return _.sortBy(hosts, ['displayName', 'id'])
    .map(pHost => <ContextSwitcherEntry key={pHost.id} alignment={"top"} icon={mdiLaptop}
                                        title={pHost.displayName || ""}
                                        active={hostID === pHost.id}
                                        color={randomColor({
                                          seed: pHost.id,
                                          luminosity: "dark"
                                        })}
                                        onClick={() => onClick(pHost.id)}/>)
}
