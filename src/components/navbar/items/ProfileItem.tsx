import React, {useEffect, useState} from "react";
import styles from "./ProfileItem.module.scss";
import NavBarItem from "../NavBarItem";
import Popup from "../Popup";
import Icon from "@mdi/react";
import {mdiChevronDown, mdiChevronUp} from "@mdi/js";

interface IProfileItem
{
  alignment: 'left' | 'right',
  iconSrc?: string,
  popupItems?: React.ReactNode,
}

const ProfileItem = (props: IProfileItem) =>
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
    <NavBarItem key={"profileitem"} className={styles.container} alignment={props.alignment} onClick={() => setPopupOpen(pV => !pV)}>
      <div className={styles.innerContainer}>
        {props.iconSrc ?
          <img className={styles.icon} src={props.iconSrc} alt={"avatar"}/> :
          <div className={styles.icon}/>}
        {<Icon path={popupOpen ? mdiChevronUp : mdiChevronDown} className={styles.dropdownArrow} size={1}/>}
      </div>
      <Popup open={popupOpen} alignment={"right"}>
        {props.popupItems}
      </Popup>
    </NavBarItem>
  );
};

export default ProfileItem;
