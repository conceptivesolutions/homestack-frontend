import { Icon } from '@mdi/react';
import classNames from 'classnames';
import React from 'react';
import styles from "./IconInput.module.scss";

type IconInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  icon?: string
};

export const IconInput: React.VFC<IconInputProps> = ({ icon, className, ...inputProps }) => (
  <div className={classNames(className, styles.container)}>
    {icon && <div className={styles.icon}><Icon path={icon} size={1} /></div>}
    <input className={styles.input} {...inputProps} />
  </div>
);