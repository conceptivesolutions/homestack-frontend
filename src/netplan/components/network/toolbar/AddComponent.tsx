import React from "react";

/**
 * Creates a new Button to add anything
 *
 * @param enabled determines if this button is active
 * @param onClick executes on click
 * @returns {JSX.Element}
 */
export default ({enabled = true, onClick}: { enabled: boolean, onClick: () => void }) =>
{
  return <button className={"fa fa-plus " + (!enabled && "disabled")} disabled={!enabled} onClick={onClick}/>
}
