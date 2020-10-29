import React from "react";
import classNames from "classnames";

interface IPopupItem
{
  children: React.ReactNode,
  iconName?: string,
  onClick?: () => void,
  separatorTop?: boolean,
}

export default (props: IPopupItem) => (
  <div className={classNames("popupitem__container", {
    "popupitem__container-separator-top": props.separatorTop
  })} onClick={props.onClick}>
    {!!props.iconName && <span className={"popupitem__icon fa fa-" + props.iconName}/>}
    <span className={"popupitem__text"}>{props.children}</span>
  </div>
)
