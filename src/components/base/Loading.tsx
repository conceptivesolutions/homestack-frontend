import classNames from "classnames";
import React from 'react';
import styles from "./Loading.module.scss"

type LoadingProps = {
  size: number,
}

export const Loading: React.VFC<LoadingProps> = ({size}) => (
  <div className={styles.container}>
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
