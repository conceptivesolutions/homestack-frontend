import React from "react";
import styles from "./ContextSwitcherEntry.module.scss"
import classNames from "classnames";

export interface IContextSwitcherEntry
{
  iconName: string,
  iconColor?: string,
  title: string,
  alignment: 'top' | 'bottom',
  active?: boolean,
  onClick?: () => void,
  color?: string,
}

const ContextSwitcherEntry = ({iconName, title, alignment, active, onClick, color, iconColor}: IContextSwitcherEntry) => (
  <button className={classNames(styles.button, {[styles.buttonActive]: active})}
          style={{backgroundColor: color, color: iconColor}}
          title={title} onClick={onClick}>
    <span className={"fa fa-" + iconName}/>
  </button>
);

export default ContextSwitcherEntry;
