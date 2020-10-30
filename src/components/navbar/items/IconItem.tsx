import React from "react";
import styles from "./IconItem.module.scss";
import NavBarItem from "../NavBarItem";

interface IIconItem
{
  alignment: 'left' | 'right',
  active?: boolean,
  iconName: string,
  onClick?: () => void,
}

const IconItem = (props: IIconItem) => (
  <NavBarItem onClick={props.onClick} active={props.active} alignment={props.alignment}>
    <span className={styles.iconitem + " fa fa-" + props.iconName}/>
  </NavBarItem>
);

export default IconItem;
