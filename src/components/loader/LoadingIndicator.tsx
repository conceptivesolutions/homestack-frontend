import React from "react";
import styles from "./LoadingIndicator.module.scss"

const LoadingIndicator = () => (
  <div className={styles.container}>
    <div className={styles.loadingioSpinner}>
      <div className={styles.loading}>
        <div/>
      </div>
    </div>
  </div>
);

export default LoadingIndicator;
