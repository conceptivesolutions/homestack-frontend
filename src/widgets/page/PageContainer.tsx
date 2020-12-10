import {mdiAccount, mdiBellOutline, mdiCogOutline, mdiHomeOutline, mdiLaptop, mdiLogout} from "@mdi/js";
import classNames from "classnames";
import TitledList from "components/lists/titledlist/TitledList";
import TitledListEntry from "components/lists/titledlist/TitledListEntry";
import ProfileItem from "components/navbar/items/ProfileItem";
import NavBar from "components/navbar/NavBar";
import NavBarItem, {INavBarItem} from "components/navbar/NavBarItem";
import PopupItem from "components/navbar/PopupItem";
import {AuthContext} from "context/AuthContext";
import {GlobalContext} from "context/GlobalContext";
import _ from "lodash";
import md5 from "md5";
import {useRouter} from "next/router";
import React, {useContext} from "react";
import {IStack} from "types/model";
import styles from "./PageContainer.module.scss";

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
  const {state: {stacks}} = useContext(GlobalContext);
  const {state: {user, logout}} = useContext(AuthContext);

  return (
    <div className={classNames(styles.container, {[styles.container__withNavigator]: !!props.navigator})}>
      <div className={styles.switcher}>
        <TitledList title={"Main"}>
          <TitledListEntry icon={mdiHomeOutline} color={"#ab6393"} active={router.pathname === "/"} url={"/"}>Dashboard</TitledListEntry>
          <TitledListEntry icon={mdiBellOutline} color={"#ecbe7a"}>Notifications</TitledListEntry>
        </TitledList>
        <TitledList title={"Stacks"}>
          {_createStackSwitcherEntries(stacks, router.query.stackID as string || "")}
        </TitledList>
      </div>
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
 * Creates the stacks entries for the switcher
 *
 * @param stacks current stacks
 * @param stackID ID of the currently selected stack
 */
function _createStackSwitcherEntries(stacks: IStack[] | undefined, stackID: string)
{
  return _.sortBy(stacks, ['displayName', 'id'])
    .map(pStack => <TitledListEntry key={pStack.id} icon={mdiLaptop}
                                    active={stackID === pStack.id}
                                    url={"/stacks/" + pStack.id}>
      {pStack.displayName || pStack.id}
    </TitledListEntry>)
}
