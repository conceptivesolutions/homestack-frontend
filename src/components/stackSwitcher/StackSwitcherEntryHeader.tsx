import React from "react";
import styles from "./StackSwitcher.module.scss"
import classNames from "classnames";
import Icon from "@mdi/react";
import {mdiPlusCircleOutline} from "@mdi/js";

export interface IContextSwitcherEntryHeader
{
  title: string,
  alignment: 'top' | 'bottom',
  hoverIcon?: string,
  hoverIconOnClick?: () => void,
}

const StackSwitcherEntryHeader = (props: IContextSwitcherEntryHeader) => (
  <div className={styles.header}>
    <span className={classNames(styles.text)}>{props.title}</span>
    {props.hoverIcon && <div onClick={props.hoverIconOnClick}>
      <Icon className={styles.headerIcon} path={mdiPlusCircleOutline} size={0.7}/>
    </div>}
  </div>
);

export default StackSwitcherEntryHeader;
