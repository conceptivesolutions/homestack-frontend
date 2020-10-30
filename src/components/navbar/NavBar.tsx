import React, {Children} from "react";
import styles from "./NavBar.module.scss";
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
  <div className={classNames(className, styles.container)}>
    <div className={styles.leftContainer}>
      {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as INavBarItem).alignment === 'left')}
    </div>
    <div className={styles.middleContainer}/>
    <div className={styles.rightContainer}>
      {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as INavBarItem).alignment === 'right')}
    </div>
  </div>
)
