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
import {ReflexContainer, ReflexElement, ReflexSplitter} from "react-reflex";
import {IStack} from "types/model";
import styles from "./PageContainer.module.scss";

export interface IPageContent
{
  navbarItems?: INavBarItem[],
  edge?: React.ReactNode,
  navigator?: React.ReactNode,
  details?: React.ReactNode,
  children?: React.ReactNode,
}

const PageContainer = (props: IPageContent) =>
{
  const router = useRouter();
  const {state: {stacks}} = useContext(GlobalContext);
  const {state: {user, logout}} = useContext(AuthContext);

  return (
    <div className={styles.container}>
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
      <div className={styles.content}>
        <ReflexContainer orientation={"vertical"}>
          {props.navigator && <ReflexElement minSize={216} flex={0.2}>
            {props.navigator}
          </ReflexElement>}
          {props.navigator && <ReflexSplitter/>}
          <ReflexElement className={styles.children}>
            {props.children}
          </ReflexElement>
          <ReflexSplitter style={props.details ? {} : {pointerEvents: "none"}}/>
          <ReflexElement minSize={props.details ? 310 : 0} flex={props.details ? 0.2 : 0} className={classNames({[styles.details]: !!props.details})}>
            {props.details}
          </ReflexElement>
        </ReflexContainer>
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
