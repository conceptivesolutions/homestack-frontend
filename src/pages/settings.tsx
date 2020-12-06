import {SettingsProvider} from "context/SettingsContext";
import React from "react";
import PageContainer from "widgets/page/PageContainer";
import StacksTable from "widgets/settings/StacksTable";
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
        <StacksTable/>
      </div>
    </PageContainer>
  </SettingsProvider>
};

// noinspection JSUnusedGlobalSymbols
export default Settings;
