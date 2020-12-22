import Icon from "@mdi/react";
import classNames from "classnames";
import React from 'react';
import styles from "./TitledListEntry.module.scss";

interface ITitledListEntry
{
  url?: string,
  icon?: string,
  color?: string,
  children?: React.ReactNode,
  className?: string,
  active?: boolean,
  onClick?: () => void,
}

const TitledListEntry = (props: ITitledListEntry) => (
  <a href={props.url} className={classNames(styles.entry, props.className, {[styles.active]: props.active})} onClick={() => props.onClick && props.onClick()}>
    {props.icon && <div className={styles.icon}>
      <Icon path={props.icon} color={props.color} size={1}/>
    </div>}
    {props.children && <span className={styles.text}>{props.children}</span>}
  </a>
);

export default TitledListEntry;
