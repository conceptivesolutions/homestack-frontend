import React from "react";
import "./NetworkToolbarComponent.scss"

/**
 * Simple Overlay Toolbar for NetworkGraph
 *
 * @param children all Toolbar-Buttons and -Components
 * @returns {JSX.Element}
 */
export default ({children}) =>
{
  return (
    <div className={"network-toolbar-container"}>
      <div className={"network-toolbar"}>
        {children}
      </div>
    </div>
  );
}
