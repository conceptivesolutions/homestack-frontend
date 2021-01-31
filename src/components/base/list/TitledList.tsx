import Icon from "@mdi/react";
import classNames from "classnames";
import React from 'react';
import { Link } from "react-router-dom";
import styles from "./TitledList.module.scss";

type TitledListProps = {
  className?: string,
  title?: string,
};

type TitledListEntryProps = {
  url?: string,
  icon?: string,
  hoverIcon?: string,
  color?: string,
  hoverIconColor?: string,
  className?: string,
  active?: boolean,
  onClick?: () => void,
  onHoverIconClick?: () => void,
}

/**
 * Displays TitledListEntries in a titled list view
 */
export const TitledList: React.FC<TitledListProps> = ({title, className, children}) => (
  <div className={classNames(styles.container, className)}>
    <span className={styles.title}>{title}</span>
    {children}
  </div>
);

/**
 * Entry for titled list
 */
export const TitledListEntry: React.FC<TitledListEntryProps> = (props) => (
  <Link to={props.url || ""} className={classNames(styles.entry, props.className, {[styles.active]: props.active})} onClick={(e) =>
  {
    if (props.onClick && e.button === 0)
    {
      e.preventDefault();
      props.onClick();
    }
  }}>
    {props.icon && <div className={styles.icon}>
      <Icon path={props.icon} color={props.color} size={1}/>
    </div>}
    {props.children && <span className={styles.text}>{props.children}</span>}
    {props.hoverIcon && <div className={styles.hoverIcon} onClick={(e) =>
    {
      if (props.onHoverIconClick && e.button === 0)
      {
        e.preventDefault();
        props.onHoverIconClick();
      }
    }}>
      <Icon path={props.hoverIcon} color={props.hoverIconColor || props.color} size={1}/>
    </div>}
  </Link>
);


