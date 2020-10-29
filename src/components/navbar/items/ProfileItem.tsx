import React, {useEffect, useState} from "react";
import "./ProfileItem.scss";
import NavBarItem from "../NavBarItem";
import Popup from "../Popup";
import classNames from "classnames";

interface IProfileItem
{
  alignment: 'left' | 'right',
  iconSrc?: string,
  popupItems?: React.ReactNode,
}

export default (props: IProfileItem) =>
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
    <NavBarItem key={"profileitem"} className={"profileitem__container"} alignment={props.alignment} onClick={() => setPopupOpen(pV => !pV)}>
      <div className={"profileitem__innercontainer"}>
        {props.iconSrc ?
          <img className={"profileitem__icon"} src={props.iconSrc} alt={"avatar"}/> :
          <div className={"profileitem__icon"}/>}
        <span className={classNames("profileitem__dropdown-arrow", "fa", {
          "fa-chevron-down": !popupOpen,
          "fa-chevron-up": popupOpen,
        })}/>
      </div>
      <Popup open={popupOpen} alignment={"right"}>
        {props.popupItems}
      </Popup>
    </NavBarItem>
  );
}
