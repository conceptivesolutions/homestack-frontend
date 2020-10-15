import React, {ReactNode, useState} from "react";
import "./NavigationItem.scss"
import {NavLink} from "react-router-dom";

/**
 * A simple Item for the NavigationComponent
 *
 * @param iconName Name of the fontAwesome-Icon (without fa-prefix)
 * @param iconElement Element to display the icon
 * @param title Title to display
 * @param children optional children
 * @param defaultOpen true, if this item should be opened by default
 * @param linkTo Link to redirect to
 * @param onClick function to execute on click
 */
export default ({iconName, iconElement, title, linkTo, children, defaultOpen = false, onClick}:
                  {
                    iconName?: string, iconElement?: ReactNode, title: string, linkTo?: string, children?: React.ReactNode, defaultOpen?: boolean,
                    onClick?: () => void
                  }) =>
{
  const [open, setOpen] = useState<boolean>(defaultOpen)

  const myChildren = (
    <>
      {iconElement || <div className={"nav-icon fa fa-" + iconName}/>}
      <div className={"nav-title"}>{title}</div>
      {children && <div className={"nav-arrow fa " + (open ? "fa-chevron-up" : "fa-chevron-down")}/>}
    </>
  )

  function fOnClick()
  {
    setOpen(pPrev => !pPrev);
    onClick && onClick();
  }

  const myItem = !!linkTo ?
    (<NavLink to={linkTo || ""} exact activeClassName={linkTo && "nav-row__selected"} className={"nav-row"} onClick={fOnClick}>{myChildren}</NavLink>) :
    (<div className={"nav-row"} onClick={fOnClick}>{myChildren}</div>);

  return (
    <div className={"nav-item"}>
      {myItem}
      <div className={open ? "nav-content__active" : "nav-content"}>
        {children}
      </div>
    </div>
  );
}
