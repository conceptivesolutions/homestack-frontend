import React from "react";
import styles from "./StackSwitcher.module.scss"
import classNames from "classnames";
import Icon from "@mdi/react";

export interface IContextSwitcherEntry
{
  icon: string,
  color?: string,
  title: string,
  alignment: 'top' | 'bottom',
  active?: boolean,
  onClick?: () => void,
}

const StackSwitcherEntry = (props: IContextSwitcherEntry) => (
  <div className={styles.entry} onClick={props.onClick}>
    <div className={styles.icon}>
      <Icon path={props.icon} color={props.color} size={0.8}/>
    </div>
    <span className={classNames(styles.text, {[styles.textActive]: props.active})}>{props.title}</span>
  </div>
);

export default StackSwitcherEntry;
