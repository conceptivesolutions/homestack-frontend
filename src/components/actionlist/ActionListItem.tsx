import React from "react";
import classNames from "classnames";
import styles from "./ActionList.module.scss";

export interface IActionListItem
{
  name: string,
  iconName?: string,
  disabled?: boolean,
  color?: string,
  onClick?: () => void,
}

const ActionListItem = (props: IActionListItem) => (
  <div className={classNames(styles.item, {[styles.itemDisabled]: props.disabled})} onClick={props.onClick}
       style={{color: props.disabled ? undefined : props.color}}>
    {!!props.iconName && <span className={styles.itemIcon + " fa fa-" + props.iconName}/>}
    <span>{props.name}</span>
  </div>
);

export default ActionListItem;
