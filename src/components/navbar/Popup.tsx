import classNames from "classnames";
import React from "react";
import styles from "./Popup.module.scss";

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
const Popup = (props: IPopup) =>
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
};

export default Popup;
