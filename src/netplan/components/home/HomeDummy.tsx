import React from "react";
import "./HomeDummy.scss"
import {createHost} from "../../rest/HostClient";
import {useAuth0} from "@auth0/auth0-react";

export default () =>
{
  const {getAccessTokenSilently} = useAuth0();

  return (
    <div className={"home__dummy"}>
      <button onClick={() =>
      {
        getAccessTokenSilently().then(pToken => createHost(pToken));
      }}>Create Default Host
      </button>
    </div>
  );
}
