import React from "react";
import "./IconItem.scss";
import NavBarItem from "../NavBarItem";

interface IIconItem
{
  alignment: 'left' | 'right',
  iconName: string,
  onClick?: () => void,
}

export default (props: IIconItem) => (
  <NavBarItem onClick={props.onClick} alignment={props.alignment}>
    <span className={"iconitem fa fa-" + props.iconName}/>
  </NavBarItem>
)
