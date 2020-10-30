import React from "react";
import styles from "./SettingsPage.module.scss"
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
      <div className={styles.container}>
        <div>Hosts</div>
        <HostsTable/>
      </div>
    </PageContainer>
  </SettingsProvider>
}
