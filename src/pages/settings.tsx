import React from "react";
import styles from "./settings.module.scss"
import {SettingsProvider} from "../context/SettingsContext";
import HostsTable from "../widgets/settings/HostsTable";
import PageContainer from "../components/page/PageContainer";

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
