import React from "react";
import styles from "./Popup.module.scss";
import classNames from "classnames";

export interface IPopup
{
  alignment?: "left" | "right",
  children?: React.ReactNode,
  className?: string,
  open?: boolean,
}

/**
 * Simple Popup container
 */
export default (props: IPopup) =>
{
  if (!props.open)
    return <></>

  const alignment = props.alignment || "left";

  return (
    <div className={classNames(props.className, styles.container, {
      [styles.containerLeft]: alignment === "left",
      [styles.containerRight]: alignment === "right",
    })}>
      {props.children}
    </div>
  );
}
