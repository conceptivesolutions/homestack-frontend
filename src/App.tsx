import React, {useEffect, useState} from 'react';
import "./App.scss"
import '@fortawesome/fontawesome-free/css/all.min.css';
import DialogContainer, {dialogStore} from "./components/dialogs/DialogContainer";
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import {Route, useHistory, useLocation} from "react-router";
import HostPage from "./pages/host/HostPage";
import SettingsPage from "./pages/settings/SettingsPage";
import HelpPage from "./pages/help/HelpPage";
import LoadingIndicator from "./components/loader/LoadingIndicator";
import ContextSwitcher from "./components/contextswitcher/ContextSwitcher";
import ContextSwitcherEntry from "./components/contextswitcher/ContextSwitcherEntry";
import {getHosts} from "./rest/HostClient";
import {IHost} from "./types/model";

const App = () =>
{
  const history = useHistory();
  const location = useLocation();
  const {getAccessTokenSilently} = useAuth0();
  const [hosts, setHosts] = useState<IHost[]>();

  useEffect(() =>
  {
    getAccessTokenSilently()
      .then((pToken) => getHosts(pToken))
      .then((pHosts => setHosts(pHosts)))
  }, [getAccessTokenSilently])

  // @ts-ignore
  return <GlobalHooksProvider hooks={[dialogStore]}>
    <ContextSwitcher className={"root_switcher"}>
      <ContextSwitcherEntry active={location.pathname === "/"} alignment={"top"} iconName={"home"} title={"Home"}/>
      {hosts?.map(pHost => <ContextSwitcherEntry key={pHost.id} alignment={"top"} iconName={"server"} title={pHost.displayName || ""}
                                                 active={location.pathname.startsWith("/hosts/" + pHost.id)}
                                                 onClick={() => history.push("/hosts/" + pHost.id)}/>)}
      <ContextSwitcherEntry alignment={"bottom"} iconName={"plus"} title={"Add System"}/>
    </ContextSwitcher>
    <div className={"root_content"}>
      <Route exact path={"/hosts/:hostID"} component={HostPage}/>
      <Route exact path={"/settings"} component={SettingsPage}/>
      <Route exact path={"/help"} component={HelpPage}/>
    </div>
    <DialogContainer/>
  </GlobalHooksProvider>;
}

export default withAuthenticationRequired(App, {
  onRedirecting: () => <LoadingIndicator/>,
});
