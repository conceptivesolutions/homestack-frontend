import React from "react";
import "./ContextSwitcherEntry.scss"

export interface IContextSwitcherEntry
{
  iconName: string,
  iconColor?: string,
  title: string,
  alignment: 'top' | 'bottom',
  active?: boolean,
  onClick?: () => void,
  color?: string,
}

// noinspection JSUnusedLocalSymbols
export default ({iconName, title, alignment, active, onClick, color, iconColor}: IContextSwitcherEntry) => (
  <button className={"contextswitcher-entry__button " + (active && "contextswitcher-entry__button-active")} style={{backgroundColor: color, color: iconColor}}
          title={title} onClick={onClick}>
    <span className={"fa fa-" + iconName}/>
  </button>
)
