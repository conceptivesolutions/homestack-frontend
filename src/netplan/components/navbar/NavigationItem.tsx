import React, {ReactNode} from "react";
import "./NavigationItem.scss"

/**
 * A simple Item for the NavigationComponent
 *
 * @param iconName Name of the fontAwesome-Icon (without fa-prefix)
 * @param iconElement Element to display the icon
 * @param title Title to display
 * @param children optional children
 * @param onClick function to execute on click
 * @param open TRUE, if this item is "opened" (if it contains children)
 * @param selected TRUE, if this item is "selected"
 */
export default ({iconName, iconElement = (<div className={"nav-icon fa fa-" + iconName}/>), title, children, onClick, open = false, selected = false}:
                  { iconName?: string, iconElement?: ReactNode, title: string, children?: React.ReactNode, onClick?: () => void, open?: boolean, selected?: boolean }) => (
  <div className={"nav-item"}>
    <div className={"nav-row " + (selected && "nav-row__selected")} onClick={onClick}>
      {iconElement}
      <div className={"nav-title"}>{title}</div>
      {children && <div className={"nav-arrow fa " + (open ? "fa-chevron-up" : "fa-chevron-down")}/>}
    </div>
    <div className={open ? "nav-content__active" : "nav-content"}>
      {children}
    </div>
  </div>
)
