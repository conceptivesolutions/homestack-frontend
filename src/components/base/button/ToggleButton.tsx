import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import styles from "./ToggleButton.module.scss";

type ToggleButtonProps = {
  value: boolean,
  onValueChange?: (isOn: boolean) => void,
};

export const ToggleButton: React.VFC<ToggleButtonProps> = ({value, onValueChange}) =>
{
  const [isOn, setIsOn] = useState<boolean>(value || false)

  // Update isOn if value changes
  useEffect(() => setIsOn(value), [value]);

  // function that executes on button click
  const _onClick = () =>
  {
    const newValue = !isOn;
    setIsOn(newValue)
    if (onValueChange)
      onValueChange(newValue)
  }

  return <div className={styles.switch} data-ison={isOn} onClick={_onClick}>
    <motion.div className={styles.handle} layout transition={{
      type: "spring",
      stiffness: 700,
      damping: 50,
    }}/>
  </div>
};
