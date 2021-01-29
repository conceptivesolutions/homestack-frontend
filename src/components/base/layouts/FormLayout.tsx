import classNames from "classnames";
import React from 'react';
import styles from "./FormLayout.module.scss";

type TableLayoutProps = {
  className?: string,
  small?: boolean,
};

/**
 * It shows the content like a table - the left side is a descriptional text and the right is the component.
 * myID: TEXTFIELD
 * myTest: CHECKBOX
 *
 * @constructor
 */
export const FormLayout: React.FC<TableLayoutProps> = ({children, className, small}) => (
  <div className={classNames(className, {
    [styles.layoutContainer]: !small,
    [styles.layoutContainer_small]: small,
  })}>
    {children}
  </div>
);
