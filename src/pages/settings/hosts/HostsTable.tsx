import React, {useContext} from "react";
import "./HostsTable.scss"
import _ from "lodash";
import {ACTION_CREATE_HOST, ACTION_REMOVE_HOST, ACTION_UPDATE_HOST, GlobalContext} from "../../../state/GlobalContext";
import {IHost} from "../../../types/model";
import SimpleGridDialogContent from "../../../components/dialogs/SimpleGridDialogContent";
import {useGlobalHook} from "@devhammed/use-global-hook";
import {IDialogStore} from "../../../types/dialog";
import {v4 as uuidv4} from 'uuid';

export default () =>
{
  const {state, dispatch} = useContext(GlobalContext);
  const {showDialog} = useGlobalHook("dialogStore") as IDialogStore;

  return (
    <>
      <table className={"settings-page__hosts-table"}>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {_.sortBy(state.hosts, ['displayName', 'id']).map(pHost => <tr key={pHost.id}>
          <td className={"settings-page__hosts-table__id"}>{pHost.id}</td>
          <td className={"settings-page__hosts-table__name"}>{pHost.displayName}</td>
          <td className={"settings-page__hosts-table__actions"}>
            <button className={"fa fa-cog"} onClick={() => _upsertHost(showDialog, dispatch, pHost)}/>
            <button className={"fa fa-trash"} onClick={() => dispatch(ACTION_REMOVE_HOST(pHost.id))}/>
          </td>
        </tr>)}
        </tbody>
      </table>
      <button className={"fa fa-plus"} onClick={() => _upsertHost(showDialog, dispatch)}/>
    </>
  )
}

/**
 * Shows a dialog to upsert an host
 *
 * @param pShowDialogFn
 * @param pDispatchFn
 * @param pHost
 */
function _upsertHost(pShowDialogFn: (dialog: any) => void, pDispatchFn: (action: any) => void, pHost?: IHost)
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
      <SimpleGridDialogContent>
        <span>ID</span>
        <span>{defaultHost.id}</span>
        <span>Name</span>
        <input autoFocus onChange={(e) => changes.displayName = e.target.value} defaultValue={defaultHost.displayName}/>
      </SimpleGridDialogContent>
    ),
    onResult: (pResult: any) =>
    {
      if (pResult === "Save")
      {
        if (pHost)
          pDispatchFn(ACTION_UPDATE_HOST(pHost))
        else
          pDispatchFn(ACTION_CREATE_HOST(pHost))
      }
    }
  })
}
