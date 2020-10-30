import React from "react";

/**
 * List of actions, displayed like a list
 *
 * @param className
 * @param children
 */
export default ({className, children}: { className?: string, children?: React.ReactNode }) => (
  <div className={className}>
    {children}
  </div>
)
