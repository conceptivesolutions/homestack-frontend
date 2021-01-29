import classNames from "classnames";
import React from 'react';
import styles from "./CardLayout.module.scss";

type CardLayoutProps = {
  header?: React.ReactNode,
  footer?: React.ReactNode,
  disableBorder?: boolean,
  className?: string,
};

export const CardLayout: React.FC<CardLayoutProps> = ({children, header, footer, disableBorder, className}) => (
  <div className={classNames(className, styles.container)}>
    <div className={styles.innerContainer}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={classNames(styles.content, {
        [styles.border]: !disableBorder,
      })}>
        {children}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  </div>
);

export const CardLayoutHeader = ({children}: { children?: React.ReactNode }) => (
  <div className={styles.headerContainer}>
    {children}
  </div>
);

export const CardLayoutFooter = ({children}: { children?: React.ReactNode }) => (
  <div className={styles.footerContainer}>
    {children}
  </div>
);
