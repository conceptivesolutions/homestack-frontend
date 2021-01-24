import { Icon } from "@mdi/react";
import classNames from "classnames";
import React from 'react';
import styles from "./ActionList.module.scss";

type ActionListProps = {
  className?: string,
};

type ActionListItemProps = {
  name: string,
  icon?: string,
  disabled?: boolean,
  color?: string,
  onClick?: () => void,
};

/**
 * List of actions, displayed like a list
 */
export const ActionList: React.FC<ActionListProps> = ({children, className}) => (
  <div className={className}>
    {children}
  </div>
);

/**
 * single entry in action list
 */
export const ActionListItem: React.VFC<ActionListItemProps> = ({name, icon, disabled, color, onClick}) => (
  <div className={classNames(styles.item, {[styles.itemDisabled]: disabled})} onClick={onClick}
       style={{color: disabled ? undefined : color}}>
    {!!icon && <Icon path={icon} size={0.8} className={styles.itemIcon}/>}
    <span>{name}</span>
  </div>
);
