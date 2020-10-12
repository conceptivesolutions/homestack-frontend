import React from "react";
import "./NetworkToolbarComponent.scss"

/**
 * Simple Overlay Toolbar for NetworkGraph
 *
 * @param children all Toolbar-Buttons and -Components
 */
export default ({children}: { children: React.ReactNode }) =>
{
  return (
    <div className={"network-toolbar-container"}>
      <div className={"network-toolbar"}>
        {children}
      </div>
    </div>
  );
}
