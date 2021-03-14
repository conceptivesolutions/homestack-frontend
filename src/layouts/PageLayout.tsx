import { mdiAccount, mdiBellOutline, mdiCogOutline, mdiHomeOutline, mdiLaptop, mdiLogout } from "@mdi/js";
import { ButtonStrip, ButtonStripItem } from "components/base/list/ButtonStrip";
import { TitledList, TitledListEntry } from "components/base/list/TitledList";
import { PopupItem } from "components/base/Popup";
import { ProfileButtonStripItem } from "components/profile/ProfileButtonStripItem";
import _ from "lodash";
import { IStack } from "models/definitions/backend/common";
import { useLogin, useUserInfo } from "models/states/AuthState";
import { useStacks } from "models/states/DataState";
import React, { Suspense } from 'react';
import { useHistory, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import { Loader } from "semantic-ui-react";
import styles from "./PageLayout.module.scss";

type PageLayoutProps = {
  stripItems?: React.ReactNode[],
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, stripItems }) =>
{
  const location = useLocation();
  const history = useHistory();
  const { logout } = useLogin();

  return (
    <>
      <ToastContainer position={"bottom-left"} autoClose={2500} newestOnTop closeOnClick draggable pauseOnHover/>
      <div className={styles.container}>
        <ButtonStrip className={styles.strip}>
          <Suspense fallback={<Loader active/>}>
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
          <Suspense fallback={<Loader active/>}>
            <StacksTitledList/>
          </Suspense>
        </div>
        <div className={styles.edge} onClick={() => history.push("/")}/>
        <div className={styles.content}>
          <Suspense fallback={<Loader active/>}>
            {children}
          </Suspense>
        </div>
      </div>
    </>
  );
};

/**
 * Item to show the user information and the appropriate user picture
 */
const UserProfileButtonStripItem: React.FC = ({ children }) =>
{
  const { getUserInfo } = useUserInfo();
  return <ProfileButtonStripItem iconSrc={getUserInfo()?.picture}>
    {children}
  </ProfileButtonStripItem>;
};

/**
 * List to show the current stacks
 */
const StacksTitledList: React.VFC = () =>
{
  const { pathname } = useLocation();
  const { stacks } = useStacks();
  return <TitledList title={"Stacks"}>
    {_createStackSwitcherEntries(stacks, pathname || "")}
  </TitledList>;
};

/**
 * Creates the stacks entries for the switcher
 *
 * @param stacks current stacks
 * @param currentPath current url
 */
function _createStackSwitcherEntries(stacks: IStack[] | null, currentPath: string)
{
  return _.sortBy(stacks, ['displayName', 'id'])
    .map(pStack => <TitledListEntry key={pStack.id} icon={mdiLaptop}
                                    active={currentPath.startsWith("/stacks/" + pStack.id)}
                                    url={"/stacks/" + pStack.id}>
      {pStack.displayName || pStack.id}
    </TitledListEntry>);
}
