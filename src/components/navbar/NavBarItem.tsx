import React from "react";
import "./NavBarItem.scss";

export interface INavBarItem
{
  alignment: 'left' | 'right',
  children?: React.ReactNode,
  className?: string,
  active?: boolean,
  onClick?: () => void,
}

export default (props: INavBarItem) => (
  <span className={(props.className || "") + " navbar-item__container " + (props.active && "navbar-item__container-active")} onClick={props.onClick}>
    {props.children}
  </span>
)
