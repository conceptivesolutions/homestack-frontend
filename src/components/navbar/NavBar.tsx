import React, {Children} from "react";
import "./NavBar.scss";
import {INavBarItem} from "./NavBarItem";
import classNames from "classnames";

export interface INavBar
{
  className?: string,
  children: React.ReactNode,
}

/**
 * Component: NavBar
 *
 * @param className
 * @param children
 */
export default ({className = "", children}: INavBar) => (
  <div className={classNames(className, "navbar__container")}>
    <div className={"navbar__left-container"}>
      {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as INavBarItem).alignment === 'left')}
    </div>
    <div className={"navbar__middle-container"}/>
    <div className={"navbar__right-container"}>
      {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as INavBarItem).alignment === 'right')}
    </div>
  </div>
)
