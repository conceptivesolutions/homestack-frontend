import React from "react";

/**
 * Creates a new Button to remove anything
 *
 * @param enabled determines if this button is active
 * @param onClick executes on click
 * @returns {JSX.Element}
 */
export default ({enabled = true, onClick}: { enabled: boolean, onClick: () => void }) =>
{
  return <button className={"fa fa-minus " + (!enabled && "disabled")} disabled={!enabled} onClick={onClick}/>
}
