import React, {ReactNode, useState} from "react";
import "./TopBarItem.scss"
import {NavLink} from "react-router-dom";

interface ITopBarItem
{
  id: string,
  iconName?: string,
  iconElement?: ReactNode,
  title: string,
  linkTo?: string,
  onClick?: () => void,
  items?: ITopBarItem[],
}

/**
 * A simple Item for the TopBarCopmonent
 *
 * @param item The item to display
 */
export default (item: ITopBarItem) =>
{
  const [childrenOpen, setChildrenOpen] = useState<boolean>(false)

  const fSetMenuVisible = (pIsOver: boolean) => () => setChildrenOpen(pIsOver)
  const fOnClick = (pItem: ITopBarItem) => () =>
  {
    if (!pItem.items)
      setChildrenOpen(false)
    else
      setChildrenOpen(true)
    pItem.onClick && pItem.onClick();
  }

  return _createContainer(item, fOnClick(item), fSetMenuVisible(true), fSetMenuVisible(false), (pItems) =>
  {
    if (!childrenOpen)
      return <></>
    return <div className={"topbar-item__children-container"}>
      {pItems.map(pSubItem => (
        <NavLink to={pSubItem.linkTo!} className={"topbar-sub-item__container"} key={pSubItem.id}
                 onClick={fOnClick(pSubItem)}>{_createContent(pSubItem)}</NavLink>
      ))}
    </div>
  })
}

/**
 * Creates the container around the given item
 *
 * @param pItem item
 * @param pOnClick function that gets executed on click
 * @param pOnMouseEnter function that gets executed on mouse enter
 * @param pOnMouseLeave function that gets executed on mouse leave
 * @param pChildren function which consumes children, if some have to be rendered
 */
function _createContainer(pItem: ITopBarItem, pOnClick: () => void, pOnMouseEnter: () => void, pOnMouseLeave: () => void,
                          pChildren: (pItems: ITopBarItem[]) => React.ReactNode)
{
  return !!pItem.linkTo ?
    (<NavLink to={pItem.linkTo || ""} exact activeClassName={pItem.linkTo && "topbar-item__container-selected"} className={"topbar-item__container"}
              onMouseOver={pOnMouseEnter} onMouseLeave={pOnMouseLeave}>
      <div className={"topbar-item__content"} onClick={pOnClick}>
        {_createContent(pItem)}
      </div>
      {pItem.items && pChildren(pItem.items)}
    </NavLink>) :
    (<div className={"topbar-item__container"} onMouseOver={pOnMouseEnter} onMouseLeave={pOnMouseLeave}>
      <div className={"topbar-item__content"} onClick={pOnClick}>
        {_createContent(pItem)}
      </div>
      {pItem.items && pChildren(pItem.items)}
    </div>);
}

/**
 * Creates the shown content (icon with text)
 *
 * @param pItem Item for text and icon
 */
function _createContent(pItem: ITopBarItem)
{
  return <>
    {pItem.iconElement || (pItem.iconName && <div className={"topbar-item__icon fa fa-" + pItem.iconName}/>)}
    <span className={"topbar-item__title"}>{pItem.title}</span>
  </>
}
