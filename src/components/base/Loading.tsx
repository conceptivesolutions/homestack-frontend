import classNames from "classnames";
import React from 'react';
import styles from "./Loading.module.scss";

type LoadingProps = {
  className?: string,
  size: number,
}

export const Loading: React.VFC<LoadingProps> = ({className, size}) => (
  <div className={classNames(className, styles.container)}>
    <div className={styles.loadingioSpinner} style={{width: size + "rem", height: size + "rem"}}>
      <div className={styles.loading}>
        <div className={classNames({
          [styles.loadingBig]: size >= 5,
          [styles.loadingMid]: size < 5 && size > 2,
          [styles.loadingSmall]: size <= 2,
        })}/>
      </div>
    </div>
  </div>
);
