import React from "react";
import classNames from "classnames";
import styles from "./Popup.module.scss"

interface IPopupItem
{
  children: React.ReactNode,
  iconName?: string,
  onClick?: () => void,
  separatorTop?: boolean,
}

const PopupItem = (props: IPopupItem) => (
  <div className={classNames(styles.popupitem__container, {
    [styles.popupitem__containerSeparatorTop]: props.separatorTop
  })} onClick={props.onClick}>
    {!!props.iconName && <span className={styles.popupitem__icon + " fa fa-" + props.iconName}/>}
    <span className={"popupitem__text"}>{props.children}</span>
  </div>
);

export default PopupItem;
