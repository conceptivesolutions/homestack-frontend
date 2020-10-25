import React from "react";
import "./SettingsPage.scss"
import {SettingsProvider} from "./state/SettingsContext";
import HostsTable from "./hosts/HostsTable";

/**
 * Page: Settings
 */
export default () =>
{
  return <SettingsProvider>
    <div className={"settings-page__container"}>
      <div>Hosts</div>
      <HostsTable/>
    </div>
  </SettingsProvider>
}
