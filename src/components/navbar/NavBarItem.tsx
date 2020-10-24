import React from "react";
import "./NavBarItem.scss";

export interface INavBarItem
{
  title: string,
  alignment: 'left' | 'right',
  active?: boolean,
  onClick?: () => void,
}

// noinspection JSUnusedLocalSymbols
export default ({title, alignment, active = false, onClick}: INavBarItem) => (
  <span className={"navbar-item__container " + (active && "navbar-item__container-active")} onClick={onClick}>
    {title}
  </span>
)
