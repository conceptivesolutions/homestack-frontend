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
      {props.iconSrc ?
        <img className={"profileitem__icon"} src={props.iconSrc} alt={"avatar"}/> :
        <div className={"profileitem__icon"}/>}
      <span className={"profileitem__dropdown-arrow fa fa-chevron-down"}/>
    </div>
  </NavBarItem>
)
