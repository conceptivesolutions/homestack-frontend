import logo from "assets/images/300.png";
import classNames from "classnames";
import { Loading } from "components/base/Loading";
import _ from "lodash";
import { useLogin } from "models/states/AuthState";
import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router";
import styles from "./LoginPage.module.scss";

export const LoginPage: React.VFC = () =>
{
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();
  const {login} = useLogin();
  const history = useHistory();
  const {state} = useLocation<{ from: string }>();

  /**
   * function that executes on form submit
   */
  const _onSubmit = (e: any) =>
  {
    e.preventDefault();

    // do not execute twice
    if (loading)
      return;

    setError(null);
    setLoading(true)
    const data = new FormData(e.target);
    const user = data.get("user");
    const pass = data.get("password");
    if (typeof user === "string" && !_.isEmpty(user) && typeof pass === "string" && !_.isEmpty(pass))
      login(user, pass)
        .then(() =>
        {
          setLoading(false);
          history.push(state.from ? state.from : "/");
        })
        .catch(pErr =>
        {
          setLoading(false);
          setError(pErr);
        })
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
            <input disabled={loading} name={"user"} autoFocus className={classNames(styles.user, {[styles.error]: !!error})}/>
            <input disabled={loading} name={"password"} type={"password"} className={classNames(styles.password, {[styles.error]: !!error})}/>
            <button className={classNames(styles.primary, styles.login)}>
              {loading ? <Loading size={1.2}/> : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
