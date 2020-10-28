import React, {useContext} from "react";
import "./PageContainer.scss";
import NavBar from "../navbar/NavBar";
import NavBarItem, {INavBarItem} from "../navbar/NavBarItem";
import IconItem from "../navbar/items/IconItem";
import ProfileItem from "../navbar/items/ProfileItem";
import {useHistory} from "react-router";
import {GlobalContext} from "../../state/GlobalContext";
import classNames from "classnames";

export interface IPageContent
{
  navbarItems?: INavBarItem[],
  edge?: React.ReactNode,
  navigator?: React.ReactNode,
  children?: React.ReactNode,
}

export default (props: IPageContent) =>
{
  const history = useHistory();
  const {state: {user}} = useContext(GlobalContext);

  return (
    <div className={classNames("pagecontent__container", {"pagecontent__container_with-navigator": !!props.navigator})}>
      <NavBar className={"pagecontent__navbar"}>
        {props.navbarItems?.map(pItem => <NavBarItem key={JSON.stringify(pItem.children)} {...pItem}/>)}
        <IconItem alignment={"right"} iconName={"cog"} active={history.location.pathname.startsWith("/settings")} onClick={() => history.push("/settings")}/>
        <IconItem alignment={"right"} iconName={"bell"}/>
        <ProfileItem alignment={"right"} iconSrc={user?.picture}/>
      </NavBar>
      <div className={"pagecontent__edge"}>
        {props.edge}
      </div>
      {<div className={"pagecontent__navigator"}>
        {props.navigator}
      </div>}
      <div className={"pagecontent__content"}>
        {props.children}
      </div>
    </div>
  );
}
