import React from "react";
import classNames from "classnames";
import styles from "./ActionList.module.scss";
import {Icon} from "@mdi/react";

export interface IActionListItem
{
  name: string,
  icon?: string,
  disabled?: boolean,
  color?: string,
  onClick?: () => void,
}

const ActionListItem = (props: IActionListItem) => (
  <div className={classNames(styles.item, {[styles.itemDisabled]: props.disabled})} onClick={props.onClick}
       style={{color: props.disabled ? undefined : props.color}}>
    {!!props.icon && <Icon path={props.icon} size={0.8} className={styles.itemIcon}/>}
    <span>{props.name}</span>
  </div>
);

export default ActionListItem;
