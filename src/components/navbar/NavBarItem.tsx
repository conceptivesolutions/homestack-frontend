import React from "react";
import styles from "./NavBarItem.module.scss";
import classNames from "classnames";

export interface INavBarItem
{
  alignment: 'left' | 'right',
  children?: React.ReactNode,
  className?: string,
  active?: boolean,
  disabled?: boolean,
  onClick?: () => void,
}

export default (props: INavBarItem) => (
  <div
    className={classNames(props.className, styles.container, {
      [styles.containerActive]: props.active,
      [styles.containerDisabled]: props.disabled,
    })}
    onClick={props.onClick}>
    <div className={styles.containerInner}>
      {props.children}
    </div>
  </div>
)
