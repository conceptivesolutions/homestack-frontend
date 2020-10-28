import React from "react";
import "./NavBarItem.scss";
import classNames from "classnames";

export interface INavBarItem
{
  alignment: 'left' | 'right',
  children?: React.ReactNode,
  className?: string,
  active?: boolean,
  onClick?: () => void,
}

export default (props: INavBarItem) => (
  <div
    className={classNames(props.className, "navbar-item__container", {"navbar-item__container-active": props.active})}
    onClick={props.onClick}>
    <div className={"navbar-item__container-inner"}>
      {props.children}
    </div>
  </div>
)
