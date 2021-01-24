import { mdiAccount, mdiBellOutline, mdiCogOutline, mdiHomeOutline, mdiLaptop, mdiLogout } from "@mdi/js";
import { ButtonStrip, ButtonStripItem } from "components/base/list/ButtonStrip";
import { TitledList, TitledListEntry } from "components/base/list/TitledList";
import { PopupItem } from "components/base/Popup";
import { ProfileButtonStripItem } from "components/profile/ProfileButtonStripItem";
import _ from "lodash";
import { IStack } from "models/backend";
import { useLogin } from "models/states/AuthState";
import React from 'react';
import { useHistory, useLocation, useParams } from "react-router";
import styles from "./PageLayout.module.scss";

type PageLayoutProps = {
  stripItems?: React.ReactNode[],
}

export const PageLayout: React.FC<PageLayoutProps> = ({children, stripItems}) =>
{
  const location = useLocation();
  const history = useHistory();
  const {stackID} = useParams<{ stackID: string }>();
  const {logout} = useLogin();

  // todo include stacks
  // todo user (profile picture)

  return (
    <div className={styles.container}>
      <ButtonStrip className={styles.strip}>
        <ProfileButtonStripItem>
          <PopupItem icon={mdiAccount}>My Profile</PopupItem>
          <PopupItem icon={mdiLogout} separatorTop onClick={logout}>Logout</PopupItem>
        </ProfileButtonStripItem>
        <ButtonStripItem icon={mdiBellOutline}/>
        <ButtonStripItem icon={mdiCogOutline} active={location.pathname.startsWith("/settings")} onClick={() => history.push("/settings")}/>
        {stripItems && _.reverse(stripItems)}
      </ButtonStrip>
      <div className={styles.context}>
        <TitledList title={"Main"}>
          <TitledListEntry icon={mdiHomeOutline} color={"#ab6393"} active={location.pathname === "/dashboard"} url={"/dashboard"}>Dashboard</TitledListEntry>
          <TitledListEntry icon={mdiBellOutline} color={"#ecbe7a"}>Notifications</TitledListEntry>
        </TitledList>
        <TitledList title={"Stacks"}>
          {_createStackSwitcherEntries(undefined, stackID || "")}
        </TitledList>
      </div>
      <div className={styles.edge} onClick={() => history.push("/")}/>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

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
