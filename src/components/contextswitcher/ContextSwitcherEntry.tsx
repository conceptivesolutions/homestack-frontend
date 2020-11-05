import React from "react";
import styles from "./ContextSwitcherEntry.module.scss"
import classNames from "classnames";
import Icon from "@mdi/react";

export interface IContextSwitcherEntry
{
  icon: string,
  iconColor?: string,
  title: string,
  alignment: 'top' | 'bottom',
  active?: boolean,
  onClick?: () => void,
  color?: string,
}

const ContextSwitcherEntry = (props: IContextSwitcherEntry) => (
  <button className={classNames(styles.button, {[styles.buttonActive]: props.active})}
          style={{backgroundColor: props.color, color: props.iconColor}}
          title={props.title} onClick={props.onClick}>
    {<Icon path={props.icon} size={1}/>}
  </button>
);

export default ContextSwitcherEntry;
