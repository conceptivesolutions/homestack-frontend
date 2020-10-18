import React from "react";
import "./SelectionDetailsComponent.scss"
import _ from "lodash";

/**
 * Renders a simple information details label on the lower screen side
 *
 * @param pNode Node to get informations from
 */
export default ({pNode}: { pNode: any }) => (
  <span className={"selection-details__text"}>{_.keys(pNode)
    .sort()
    .map(pKey => pKey + " = " + pNode[pKey])
    .join(", ")}</span>
)
