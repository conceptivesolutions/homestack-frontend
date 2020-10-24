import React from "react";
import "./ProfileItem.scss";
import NavBarItem from "../NavBarItem";

interface IProfileItem
{
  alignment: 'left' | 'right',
  iconSrc?: string,
}

export default (props: IProfileItem) => (
  <NavBarItem className={"profileitem__container"} alignment={props.alignment}>
    <div className={"profileitem__innercontainer"}>
      <img src={props.iconSrc} alt={"avatar"}/>
      <span className={"profileitem__dropdown-arrow fa fa-chevron-down"}/>
    </div>
  </NavBarItem>
)
