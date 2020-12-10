import React from 'react';
import styles from "./TitledList.module.scss";

interface ITitledList
{
  title?: string,
  children?: React.ReactNode,
}

/**
 * Displays TitledListEntries in a titled list view
 */
const TitledList = (props: ITitledList) => (
  <div className={styles.container}>
    <span className={styles.title}>{props.title}</span>
    {props.children}
  </div>
);

export default TitledList;
