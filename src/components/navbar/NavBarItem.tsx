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
  <div
    className={(props.className || "") + " navbar-item__container " + (props.active && " navbar-item__container-active") + " navbar-item__container-" + props.alignment}
    onClick={props.onClick}>
    <div className={"navbar-item__container-inner"}>
      {props.children}
    </div>
  </div>
)
