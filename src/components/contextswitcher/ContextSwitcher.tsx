import React, {Children} from "react";
import "./ContextSwitcher.scss"
import {IContextSwitcherEntry} from "./ContextSwitcherEntry";

/**
 * Component: Context Switcher
 * Displays a navigation bar (on the left side)
 *
 * @param className
 * @param children
 */
export default ({className, children}: { className?: string, children?: React.ReactNode }) => (
  <div className={className + " contextswitcher__container"}>
      <div className={"contextswitcher__upper-container"}>
          {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as IContextSwitcherEntry).alignment === 'top')}
      </div>
      <div className={"contextswitcher__middle-container"}/>
      <div className={"contextswitcher__lower-container"}>
            {Children.toArray(children).filter(pChild => ((pChild as React.Component).props as IContextSwitcherEntry).alignment === 'bottom')}
      </div>
  </div>
)
