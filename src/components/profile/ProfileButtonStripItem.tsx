import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import { ButtonStripItem } from "components/base/list/ButtonStrip";
import { Popup } from "components/base/Popup";
import React, { useEffect, useState } from "react";
import styles from "./ProfileButtonStripItem.module.scss";

type ProfileButtonStripItemProps = {
  iconSrc?: string
};

export const ProfileButtonStripItem: React.FC<ProfileButtonStripItemProps> = ({iconSrc, children}) =>
{
  const [popupOpen, setPopupOpen] = useState<boolean>(false)

  useEffect(() =>
  {
    if (!popupOpen)
      return;

    const listener = () => setPopupOpen(false)
    window.addEventListener("click", listener)
    return () => window.removeEventListener("click", listener)
  }, [popupOpen, setPopupOpen])

  return (
    <ButtonStripItem key={"profileitem"} className={styles.container} onClick={() => setPopupOpen(pV => !pV)}>
      <div className={styles.innerContainer}>
        {iconSrc ?
          <img className={styles.icon} src={iconSrc} alt={"avatar"}/> :
          <div className={styles.icon}/>}
        {<Icon path={popupOpen ? mdiChevronUp : mdiChevronDown} className={styles.dropdownArrow} size={1}/>}
      </div>
      <Popup open={popupOpen} alignment={"right"}>
        {children}
      </Popup>
    </ButtonStripItem>
  );
};
