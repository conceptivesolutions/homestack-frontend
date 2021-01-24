import React from 'react';
import styles from "./Loading.module.scss"

export const Loading: React.VFC = () => (
  <div className={styles.container}>
    <div className={styles.loadingioSpinner}>
      <div className={styles.loading}>
        <div/>
      </div>
    </div>
  </div>
);
