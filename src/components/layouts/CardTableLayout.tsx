import classNames from "classnames";
import React from 'react';
import styles from "./CardTableLayout.module.scss";

interface ICardTableLayout
{
  children?: React.ReactNode,
  className?: string,
  small?: boolean,
}

/**
 * A CardTable Layout describes something similar as a Form Layout.
 * It shows the content like a table - the left side is a descriptional text and the right is the component.
 * myID: TEXTFIELD
 * myTest: CHECKBOX
 *
 * @constructor
 */
const CardTableLayout = (props: ICardTableLayout) => (
  <div className={classNames(props.className, {
    [styles.layoutContainer]: !props.small,
    [styles.layoutContainer_small]: props.small
  })}>
    {props.children}
  </div>
);

export default CardTableLayout;
