import logo from "assets/images/300.png";
import _ from "lodash";
import { useLogin } from "models/states/AuthState";
import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import { Button, Input } from "semantic-ui-react";
import styles from "./LoginPage.module.scss";

export const LoginPage: React.VFC = () =>
{
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>();
  const { login } = useLogin();
  const history = useHistory();
  const { state } = useLocation<{ from: string }>();

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
    setLoading(true);
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
          toast.error(pErr.message);
          setLoading(false);
          setError(pErr);
        });
    else
    {
      toast.error("Please enter a valid email and password combination");
      setLoading(false);
      setError(new Error());
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src={logo} alt={"logo"}/>
        </div>
        <div className={styles.right}>
          <form className={styles.form} onSubmit={_onSubmit}>
            <h1 className={styles.header}>Login</h1>
            <Input iconPosition={"left"} placeholder={"E-Mail"} icon={"mail"} disabled={loading} name={"user"} error={!!error} autoFocus className={styles.user}/>
            <Input iconPosition={"left"} placeholder={"Password"} icon={"lock"} disabled={loading} name={"password"} error={!!error} type={"password"} className={styles.password}/>
            <Button loading={loading} primary className={styles.login}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
