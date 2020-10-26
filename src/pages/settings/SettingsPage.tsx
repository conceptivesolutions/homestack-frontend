import React from "react";
import "./SettingsPage.scss"
import {SettingsProvider} from "./state/SettingsContext";
import HostsTable from "./hosts/HostsTable";
import PageContainer from "../../components/page/PageContainer";

/**
 * Page: Settings
 */
export default () =>
{
  return <SettingsProvider>
    <PageContainer>
      <div className={"settings-page__container"}>
        <div>Hosts</div>
        <HostsTable/>
      </div>
    </PageContainer>
  </SettingsProvider>
}
