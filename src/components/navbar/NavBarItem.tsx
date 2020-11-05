import React from "react";
import styles from "./NavBarItem.module.scss";
import classNames from "classnames";
import Icon from "@mdi/react";

export interface INavBarItem
{
  alignment: 'left' | 'right',
  icon?: string,
  children?: React.ReactNode,
  className?: string,
  active?: boolean,
  disabled?: boolean,
  onClick?: () => void,
}

const NavBarItem = (props: INavBarItem) => (
  <div
    className={classNames(props.className, styles.container, {
      [styles.containerActive]: props.active,
      [styles.containerDisabled]: props.disabled,
    })}
    onClick={props.onClick}>
    <div className={styles.containerInner}>
      {props.icon && <Icon path={props.icon} size={0.8}/>}
      {props.children}
    </div>
  </div>
);

export default NavBarItem;
