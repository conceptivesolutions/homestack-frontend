import React, {useCallback, useEffect, useState} from "react";
import "./SettingsPage.scss"
import {useAuth0} from "@auth0/auth0-react";
import {IHost} from "../../types/model";
import {createHost, deleteHost, getHosts, updateHost} from "../../rest/HostClient";
import {useGlobalHook} from "@devhammed/use-global-hook";
import {IDialogStore} from "../../types/dialog";
import {v4 as uuidv4} from 'uuid';
import _ from "lodash";
import SimpleGridDialogContainer from "../../components/dialogs/SimpleGridDialogContent";

/**
 * Page: Settings
 */
export default () =>
{
  const {showDialog} = useGlobalHook("dialogStore") as IDialogStore;
  const {getAccessTokenSilently} = useAuth0();
  const [hosts, setHosts] = useState<IHost[]>([]);

  const _refresh = useCallback(() =>
  {
    getAccessTokenSilently()
      .then(pToken => getHosts(pToken))
      .then((pHosts) => setHosts(pHosts))
  }, [getAccessTokenSilently]);

  // Load hosts
  useEffect(() => _refresh(), [_refresh])

  return <div className={"settings-page__container"}>
    <div>Hosts</div>
    {_createHostsTable(hosts, showDialog, getAccessTokenSilently, _refresh)}
    <button className={"fa fa-plus"} onClick={() => _upsertHost(showDialog, getAccessTokenSilently, _refresh)}/>
  </div>
}

/**
 * Creates the table for the hosts overview
 *
 * @param hosts contains an array of all hosts
 * @param pShowDialogFn Function to show dialogs
 * @param pTokenFn Function to retrieve the accesstoken for backend
 * @param pRefreshFn Function to refresh all data
 */
function _createHostsTable(hosts: IHost[], pShowDialogFn: (dialog: any) => void, pTokenFn: () => Promise<string>, pRefreshFn: () => void)
{
  return <table className={"settings-page__hosts-table"}>
    <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th/>
    </tr>
    </thead>
    <tbody>
    {_.sortBy(hosts, ['displayName', 'id']).map(pHost => <tr key={pHost.id}>
      <td className={"settings-page__hosts-table__id"}>{pHost.id}</td>
      <td className={"settings-page__hosts-table__name"}>{pHost.displayName}</td>
      <td className={"settings-page__hosts-table__actions"}>
        <button className={"fa fa-cog"} onClick={() => _upsertHost(pShowDialogFn, pTokenFn, pRefreshFn, pHost)}/>
        <button className={"fa fa-trash"} onClick={() => _deleteHost(pShowDialogFn, pTokenFn, pRefreshFn, pHost)}/>
      </td>
    </tr>)}
    </tbody>
  </table>
}

/**
 * Shows a dialog to upsert an host
 *
 * @param pShowDialogFn Function to show dialogs
 * @param pTokenFn Function to retrieve the accesstoken for backend
 * @param pRefreshFn Function to refresh all data
 * @param pHost Host if updating, null if new
 */
function _upsertHost(pShowDialogFn: (dialog: any) => void, pTokenFn: () => Promise<string>, pRefreshFn: () => void, pHost?: IHost)
{
  const defaultHost = pHost || {
    id: uuidv4()
  }
  let changes: IHost = {
    id: defaultHost.id,
  };

  pShowDialogFn({
    primaryKey: "Save",
    title: pHost ? "Modify Host '" + (pHost.displayName || pHost.id) + "'" : "Create New Host",
    children: (
      <SimpleGridDialogContainer>
        <span>ID</span>
        <span>{defaultHost.id}</span>
        <span>Name</span>
        <input autoFocus onChange={(e) => changes.displayName = e.target.value} defaultValue={defaultHost.displayName}/>
      </SimpleGridDialogContainer>
    ),
    onResult: (pResult: any) =>
    {
      if (pResult === "Save")
        pTokenFn()
          .then(pToken =>
          {
            if (pHost)
              return updateHost(pToken, changes);
            return createHost(pToken, changes);
          })
          .then(() => pRefreshFn())
    }
  })
}

/**
 * Deletes the host with the given ID
 *
 * @param pShowDialogFn Function to show dialogs
 * @param pTokenFn Function to retrieve the accesstoken for backend
 * @param pRefreshFn Function to refresh all data
 * @param pHost Host that should be deleted
 */
function _deleteHost(pShowDialogFn: (dialog: any) => void, pTokenFn: () => Promise<string>, pRefreshFn: () => void, pHost: IHost)
{
  pShowDialogFn({
    primaryKey: "Delete",
    title: "Delete Host",
    children: <span>Do you really want to delete {pHost.displayName} ({pHost.id})?<br/>
    This action can not be undone and will result in deleting the corresponding devices too</span>,
    onResult: (pResult: any) =>
    {
      if (pResult === "Delete")
        pTokenFn()
          .then(pToken => deleteHost(pToken, pHost.id))
          .then(() => pRefreshFn())
    }
  })
}
