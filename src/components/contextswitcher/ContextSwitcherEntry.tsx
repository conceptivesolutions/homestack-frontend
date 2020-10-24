import React from "react";
import "./ContextSwitcherEntry.scss"

export interface IContextSwitcherEntry
{
  iconName: string,
  title: string,
  alignment: 'top' | 'bottom',
  active?: boolean,
  onClick?: () => void,
}

// noinspection JSUnusedLocalSymbols
export default ({iconName, title, alignment, active, onClick}: IContextSwitcherEntry) => (
  <button className={"contextswitcher-entry__button " + (active && "contextswitcher-entry__button-active")} title={title} onClick={onClick}>
    <span className={"fa fa-" + iconName}/>
  </button>
)
