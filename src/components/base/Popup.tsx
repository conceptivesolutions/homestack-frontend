import Icon from "@mdi/react";
import classNames from "classnames";
import React from 'react';
import styles from "./Popup.module.scss";

type PopupProps = {
  alignment?: "left" | "right",
  className?: string,
  open?: boolean,
};

type PopupItemProps = {
  icon?: string,
  onClick?: () => void,
  separatorTop?: boolean,
};

export const Popup: React.FC<PopupProps> = ({children, alignment = "left", className, open}) =>
{
  if (!open)
    return <></>

  return (
    <div className={classNames(className, styles.container, {
      [styles.containerLeft]: alignment === "left",
      [styles.containerRight]: alignment === "right",
    })}>
      {children}
    </div>
  );
};

export const PopupItem: React.FC<PopupItemProps> = ({children, icon, onClick, separatorTop}) => (
  <div className={classNames(styles.itemContainer, {
    [styles.itemSeparatorTop]: separatorTop
  })} onClick={onClick}>
    {!!icon && <Icon path={icon} size={0.8} className={styles.itemIcon}/>}
    <span>
      {children}
    </span>
  </div>
);
