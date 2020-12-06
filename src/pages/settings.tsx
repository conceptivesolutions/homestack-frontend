import React from "react";
import PageContainer from "widgets/page/PageContainer";
import {SettingsProvider} from "../context/SettingsContext";
import HostsTable from "../widgets/settings/HostsTable";
import styles from "./settings.module.scss"

/**
 * Page: Settings
 */
const Settings = () =>
{
  return <SettingsProvider>
    <PageContainer>
      <div className={styles.container}>
        <div>Hosts</div>
        <HostsTable/>
      </div>
    </PageContainer>
  </SettingsProvider>
};

export default Settings;
