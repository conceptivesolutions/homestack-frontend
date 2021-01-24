import Icon from "@mdi/react";
import classNames from "classnames";
import React from "react";
import styles from "./ButtonStrip.module.scss";

type ButtonStripProps = {
  className?: string,
};

type ButtonStripItemProps = {
  icon?: string,
  className?: string,
  active?: boolean,
  disabled?: boolean,
  onClick?: () => void,
};

export const ButtonStrip: React.FC<ButtonStripProps> = ({children, className}) => (
  <div className={classNames(className, styles.container)}>
    {children}
  </div>
);

export const ButtonStripItem: React.FC<ButtonStripItemProps> = ({children, icon, className, active, disabled, onClick}) => (
  <div
    className={classNames(className, styles.item, {
      [styles.itemActive]: active,
      [styles.itemDisabled]: disabled,
    })}
    onClick={onClick}>
    <div className={styles.itemInner}>
      {icon && <Icon path={icon} size={0.8}/>}
      {children}
    </div>
  </div>
);
