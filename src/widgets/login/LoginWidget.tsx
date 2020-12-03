import React, {createRef} from "react";
import styles from "./LoginWidget.module.scss";
import classNames from "classnames";
import Image from "next/image";
import {POST} from "../../helpers/fetchHelper";

const LoginWidget = ({onTokenReceived}: { onTokenReceived: (token: string) => void }) =>
{
  const usernameRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();
  const _executeLogin = () => POST("/api/auth/login", null, JSON.stringify({
    "loginId": usernameRef.current!.value,
    "password": passwordRef.current!.value,
  }))
    .then(pResult => pResult.json())
    .then(pResult => onTokenReceived(pResult.token));

  return (
    <>
      <div className={styles.overlay}>
        <form className={styles.container} onSubmit={e =>
        {
          _executeLogin();
          e.preventDefault();
        }}>
          <input className={styles.user} autoFocus placeholder={"E-Mail"} type={"user"} ref={usernameRef}/>
          <input className={styles.password} placeholder={"Password"} type={"password"} ref={passwordRef}/>
          <button className={classNames(styles.primary, styles.submit)}>Login</button>
        </form>
      </div>
      <Image className={styles.background} src={"/tech.jpg"} alt={""} unsized/>
    </>
  );
}

export default LoginWidget;
