import React from "react";
import "./Popup.scss";
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
    <div className={classNames(props.className, "popup__container", "popup__container-" + alignment)}>
      {props.children}
    </div>
  );
}
