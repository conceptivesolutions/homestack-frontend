import {SettingsProvider} from "context/SettingsContext";
import React from "react";
import PageContainer from "widgets/page/PageContainer";
import HostsTable from "widgets/settings/HostsTable";
import styles from "./settings.module.scss"

/**
 * Page: Settings
 */
const Settings = () =>
{
  return <SettingsProvider>
    <PageContainer>
      <div className={styles.container}>
        <div>Stacks</div>
        <HostsTable/>
      </div>
    </PageContainer>
  </SettingsProvider>
};

// noinspection JSUnusedGlobalSymbols
export default Settings;
