import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import { ButtonStripItem } from "components/base/list/ButtonStrip";
import { Popup } from "components/base/Popup";
import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./ProfileButtonStripItem.module.scss";

type ProfileButtonStripItemProps = {
  iconSrc?: string
};

export const ProfileButtonStripItem: React.FC<ProfileButtonStripItemProps> = ({ iconSrc, children }) =>
{
  const [popupOpen, setPopupOpen] = useState<boolean>(false)

  return (
    <OutsideClickHandler display={"flex"} onOutsideClick={() => setPopupOpen(false)}>
      <ButtonStripItem key={"profileitem"} className={styles.container} onClick={() => setPopupOpen(pV => !pV)}>
        <div className={styles.innerContainer}>
          {iconSrc ?
            <img className={styles.icon} src={iconSrc} alt={"avatar"}/> :
            <div className={styles.icon}/>}
          {<Icon path={popupOpen ? mdiChevronUp : mdiChevronDown} className={styles.dropdownArrow} size={1}/>}
        </div>
        <Popup className={styles.popup} open={popupOpen} alignment={"right"}>
          {children}
        </Popup>
      </ButtonStripItem>
    </OutsideClickHandler>
  );
};
