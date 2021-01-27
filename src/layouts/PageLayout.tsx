import { mdiAccount, mdiBellOutline, mdiCogOutline, mdiHomeOutline, mdiLaptop, mdiLogout } from "@mdi/js";
import { ButtonStrip, ButtonStripItem } from "components/base/list/ButtonStrip";
import { TitledList, TitledListEntry } from "components/base/list/TitledList";
import { Loading } from "components/base/Loading";
import { PopupItem } from "components/base/Popup";
import { ProfileButtonStripItem } from "components/profile/ProfileButtonStripItem";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { useLogin } from "models/states/AuthState";
import { useStacks } from "models/states/DataState";
import { useUserInfo } from "models/states/UserState";
import React, { Suspense } from 'react';
import { useHistory, useLocation, useParams } from "react-router";
import styles from "./PageLayout.module.scss";

type PageLayoutProps = {
  stripItems?: React.ReactNode[],
}

export const PageLayout: React.FC<PageLayoutProps> = ({children, stripItems}) =>
{
  const location = useLocation();
  const history = useHistory();
  const {logout} = useLogin();

  // todo include stacks

  return (
    <div className={styles.container}>
      <ButtonStrip className={styles.strip}>
        <Suspense fallback={<Loading size={1.5}/>}>
          <UserProfileButtonStripItem>
            <PopupItem icon={mdiAccount}>My Profile</PopupItem>
            <PopupItem icon={mdiLogout} separatorTop onClick={logout}>Logout</PopupItem>
          </UserProfileButtonStripItem>
        </Suspense>
        <ButtonStripItem icon={mdiBellOutline}/>
        <ButtonStripItem icon={mdiCogOutline} active={location.pathname.startsWith("/settings")} onClick={() => history.push("/settings")}/>
        {stripItems && _.reverse(stripItems)}
      </ButtonStrip>
      <div className={styles.context}>
        <TitledList title={"Main"}>
          <TitledListEntry icon={mdiHomeOutline} color={"#ab6393"} active={location.pathname === "/dashboard"} url={"/dashboard"}>Dashboard</TitledListEntry>
          <TitledListEntry icon={mdiBellOutline} color={"#ecbe7a"}>Notifications</TitledListEntry>
        </TitledList>
        <Suspense fallback={<Loading size={1.5}/>}>
          <StacksTitledList/>
        </Suspense>
      </div>
      <div className={styles.edge} onClick={() => history.push("/")}/>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

/**
 * Item to show the user information and the appropriate user picture
 */
const UserProfileButtonStripItem: React.FC = ({children}) =>
{
  const {getUserInfo} = useUserInfo();
  return <ProfileButtonStripItem iconSrc={getUserInfo()?.picture}>
    {children}
  </ProfileButtonStripItem>
}

/**
 * List to show the current stacks
 */
const StacksTitledList: React.VFC = () =>
{
  const {stackID} = useParams<{ stackID: string }>();
  const {stacks} = useStacks();
  return <TitledList title={"Stacks"}>
    {_createStackSwitcherEntries(stacks, stackID || "")}
  </TitledList>
}

/**
 * Creates the stacks entries for the switcher
 *
 * @param stacks current stacks
 * @param stackID ID of the currently selected stack
 */
function _createStackSwitcherEntries(stacks: IStack[] | null, stackID: string)
{
  return _.sortBy(stacks, ['displayName', 'id'])
    .map(pStack => <TitledListEntry key={pStack.id} icon={mdiLaptop}
                                    active={stackID === pStack.id}
                                    url={"/stacks/" + pStack.id}>
      {pStack.displayName || pStack.id}
    </TitledListEntry>)
}
