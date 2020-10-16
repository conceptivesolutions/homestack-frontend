import React, {ReactNode} from "react";
import "./SimpleGridDialogContent.scss"

/**
 * Describes a simple dialog that will display its children
 * with a table layout. First column describes a name, the second column is the editor component.
 *
 * @param children
 */
export default ({children}: { children?: ReactNode }) => (
  <div className={"simple-grid-dialog__container"}>
    {children}
  </div>
)
