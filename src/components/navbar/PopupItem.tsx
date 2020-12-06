import Icon from "@mdi/react";
import classNames from "classnames";
import React from "react";
import styles from "./Popup.module.scss"

interface IPopupItem
{
  children: React.ReactNode,
  icon?: string,
  onClick?: () => void,
  separatorTop?: boolean,
}

const PopupItem = (props: IPopupItem) => (
  <div className={classNames(styles.popupitem__container, {
    [styles.popupitem__containerSeparatorTop]: props.separatorTop
  })} onClick={props.onClick}>
    {!!props.icon && <Icon path={props.icon} size={0.8} className={styles.popupitem__icon}/>}
    <span>
      {props.children}
    </span>
  </div>
);

export default PopupItem;
