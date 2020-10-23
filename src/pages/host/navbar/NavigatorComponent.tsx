import React from "react";
import "./NavigatorComponent.scss";
import ComponentTreeComponent from "./ComponentTreeComponent";

/**
 * Simple Navigator
 *
 * @param className
 */
export default ({className}: { className: string }) => (
  <div className={(className || "") + " navigator__container"}>
    {_createSubComponent("Device Tree", <ComponentTreeComponent/>)}
  </div>
)

/**
 * Creates a new sub component for this navigator
 *
 * @param pHeader Header-Name
 * @param pComponent Component
 */
function _createSubComponent(pHeader: string, pComponent: React.ReactNode): React.ReactNode
{
  return <div className={"navigator__subcomponent"}>
    <div className={"navigator__subcomponent-header"}>{pHeader}</div>
    <div className={"navigator__subcomponent-content"}>
      {pComponent}
    </div>
  </div>
}
