import React from 'react';
import styles from "./ErrorPage.module.scss";

export const ErrorPage: React.VFC = () => (
  <div className={styles.container}>
    <h1>404 Not Found</h1>
    <span>The page you are looking for could not be found</span>
  </div>
);
