import React, {Children} from "react";
import styles from "./ContextSwitcher.module.scss"
import {IContextSwitcherEntry} from "./ContextSwitcherEntry";
import classNames from "classnames";

/**
 * Component: Context Switcher
 * Displays a navigation bar (on the left side)
 *
 * @param className
 * @param children
 */
export default ({className, children}: { className?: string, children?: React.ReactNode }) => (
  <div className={classNames(className, styles.container)}>
          <div className={styles.upperContainer}>
                  {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as IContextSwitcherEntry).alignment === 'top')}
          </div>
          <div className={styles.middleContainer}/>
          <div className={styles.lowerContainer}>
                  {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as IContextSwitcherEntry).alignment === 'bottom')}
          </div>
  </div>
)
