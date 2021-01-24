import logo from "assets/images/300.png";
import classNames from "classnames";
import { Loading } from "components/base/Loading";
import React, { useState } from 'react';
import styles from "./LoginPage.module.scss";

export const LoginPage: React.VFC = () =>
{
  const [loading, setLoading] = useState<boolean>(false);

  const _onSubmit = (e: any) =>
  {
    try
    {
      e.preventDefault();
      setLoading(true)
      new FormData(e.target); // todo login
    } finally
    {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src={logo} alt={"logo"}/>
        </div>
        <div className={styles.right}>
          <form className={styles.form} onSubmit={_onSubmit}>
            <h1 className={styles.header}>Login</h1>
            <input name={"user"} autoFocus className={styles.user}/>
            <input name={"password"} type={"password"} className={styles.password}/>
            <button className={classNames(styles.primary, styles.login)}>
              {loading ? <Loading size={1.2}/> : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
