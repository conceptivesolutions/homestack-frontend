import Icon from "@mdi/react";
import classNames from "classnames";
import React from 'react';
import { Link } from "react-router-dom";
import styles from "./TitledList.module.scss";

type TitledListProps = {
  title?: string,
};

type TitledListEntryProps = {
  url?: string,
  icon?: string,
  color?: string,
  className?: string,
  active?: boolean,
  onClick?: () => void,
}

/**
 * Displays TitledListEntries in a titled list view
 */
export const TitledList: React.FC<TitledListProps> = ({title, children}) => (
  <div className={styles.container}>
    <span className={styles.title}>{title}</span>
    {children}
  </div>
);

/**
 * Entry for titled list
 */
export const TitledListEntry: React.FC<TitledListEntryProps> = ({url, icon, color, children, className, active, onClick}) => (
  <Link to={url || ""} className={classNames(styles.entry, className, {[styles.active]: active})} onClick={(e) =>
  {
    if (onClick && e.button === 0)
    {
      e.preventDefault();
      onClick();
    }
  }}>
    {icon && <div className={styles.icon}>
      <Icon path={icon} color={color} size={1}/>
    </div>}
    {children && <span className={styles.text}>{children}</span>}
  </Link>
);


