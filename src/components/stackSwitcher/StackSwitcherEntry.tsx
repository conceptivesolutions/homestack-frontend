import Icon from "@mdi/react";
import classNames from "classnames";
import React from "react";
import styles from "./StackSwitcher.module.scss"

export interface IContextSwitcherEntry
{
  icon: string,
  color?: string,
  title: string,
  alignment: 'top' | 'bottom',
  active?: boolean,
  url?: string,
}

const StackSwitcherEntry = (props: IContextSwitcherEntry) => (
  <a href={props.url || ""} className={classNames(styles.entry, {[styles.entryActive]: props.active})}>
    <div className={styles.icon}>
      <Icon path={props.icon} color={props.color} size={1}/>
    </div>
    <span className={classNames(styles.text)}>{props.title}</span>
  </a>
);

export default StackSwitcherEntry;
