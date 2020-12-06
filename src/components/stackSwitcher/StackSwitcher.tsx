import classNames from "classnames";
import React, {Children} from "react";
import styles from "./StackSwitcher.module.scss"
import {IContextSwitcherEntry} from "./StackSwitcherEntry";

/**
 * Component: Context Switcher
 * Displays a navigation bar (on the left side)
 *
 * @param className
 * @param children
 */
const StackSwitcher = ({className, children}: { className?: string, children?: React.ReactNode }) => (
  <div className={classNames(className, styles.container)}>
          <div className={styles.upperContainer}>
                  {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as IContextSwitcherEntry).alignment === 'top')}
          </div>
          <div className={styles.middleContainer}/>
          <div className={styles.lowerContainer}>
                  {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as IContextSwitcherEntry).alignment === 'bottom')}
          </div>
  </div>
);

export default StackSwitcher;
