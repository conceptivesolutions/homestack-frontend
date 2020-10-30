import React from "react";
import styles from "./LoadingIndicator.module.scss"

export default () => (
  <div className={styles.container}>
    <div className={styles.loadingioSpinner}>
      <div className={styles.loading}>
        <div/>
      </div>
    </div>
  </div>
)
