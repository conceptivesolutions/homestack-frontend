import classNames from "classnames";
import React from 'react';
import styles from "./CardLayout.module.scss";

interface ICardLayout
{
  header?: React.ReactNode,
  footer?: React.ReactNode,
  className?: string,
  children: React.ReactNode,
}

const CardLayout = (props: ICardLayout) => (
  <div className={classNames(props.className, styles.container)}>
    <div className={styles.innerContainer}>
      {props.header && <div className={styles.header}>{props.header}</div>}
      <div className={styles.content}>
        {props.children}
      </div>
      {props.footer && <div className={styles.header}>{props.footer}</div>}
    </div>
  </div>
);

export const CardLayoutHeader = ({children}: { children?: React.ReactNode }) => (
  <div className={styles.headerContainer}>
    {children}
  </div>
)

export const CardLayoutFooter = ({children}: { children?: React.ReactNode }) => (
  <div className={styles.footerContainer}>
    {children}
  </div>
)

export default CardLayout;