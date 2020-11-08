import {motion} from 'framer-motion';
import React, {useState} from 'react';
import styles from "./SwitchButton.module.scss";

interface ISwitchButton
{
  value: boolean,
  children?: React.ReactNode,
  onValueChange?: (isOn: boolean) => void,
}

const SwitchButton = (props: ISwitchButton) =>
{
  const [isOn, setIsOn] = useState<boolean>(props.value || false)
  return <div className={styles.switch} data-isOn={isOn} onClick={() =>
  {
    const newValue = !isOn;
    setIsOn(newValue)
    if (props.onValueChange)
      props.onValueChange(newValue)
  }}>
    <motion.div className={styles.handle} layout transition={{
      type: "spring",
      stiffness: 700,
      damping: 50,
    }}/>
  </div>
};

export default SwitchButton;
