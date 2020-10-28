import React from "react";
import classNames from "classnames";

export interface IActionListItem
{
  name: string,
  iconName?: string,
  disabled?: boolean,
  color?: string,
  onClick?: () => void,
}

export default (props: IActionListItem) => (
  <div className={classNames("actionlist__item", {"actionlist__item-disabled": props.disabled})} onClick={props.onClick}
       style={{color: props.disabled ? undefined : props.color}}>
    {!!props.iconName && <span className={"actionlist__item-icon fa fa-" + props.iconName}/>}
    <span>{props.name}</span>
  </div>
)
