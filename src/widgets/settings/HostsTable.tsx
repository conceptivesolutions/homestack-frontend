import React, {useContext} from "react";
import styles from "./HostsTable.module.scss"
import _ from "lodash";
import {ACTION_CREATE_HOST, ACTION_REMOVE_HOST, ACTION_UPDATE_HOST, GlobalContext} from "../../context/GlobalContext";
import {IHost} from "../../types/model";
import SimpleGridDialogContent from "../../components/dialogs/SimpleGridDialogContent";
import {useGlobalHook} from "@devhammed/use-global-hook";
import {IDialogStore} from "../../types/dialog";
import {v4 as uuidv4} from 'uuid';
import Icon from "@mdi/react";
import {mdiCogOutline, mdiPlus, mdiTrashCanOutline} from "@mdi/js";

const HostsTable = () =>
{
  const {state, dispatch} = useContext(GlobalContext);
  const {showDialog} = useGlobalHook("dialogStore") as IDialogStore;

  return (
    <>
      <table className={styles.hostsTable}>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {_.sortBy(state.hosts, ['displayName', 'id']).map(pHost => <tr key={pHost.id}>
          <td>{pHost.id}</td>
          <td className={styles.hostsTable__name}>{pHost.displayName}</td>
          <td>
            <button onClick={() => _upsertHost(showDialog, dispatch, pHost)}>
              <Icon path={mdiCogOutline} size={0.8}/>
            </button>
            <button onClick={() => dispatch(ACTION_REMOVE_HOST(pHost.id))}>
              <Icon path={mdiTrashCanOutline} size={0.8}/>
            </button>
          </td>
        </tr>)}
        </tbody>
      </table>
      <button onClick={() => _upsertHost(showDialog, dispatch)}>
        <Icon path={mdiPlus} size={0.8}/>
      </button>
    </>
  )
}

export default HostsTable;

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
          pDispatchFn(ACTION_UPDATE_HOST(changes))
        else
          pDispatchFn(ACTION_CREATE_HOST(pHost))
      }
    }
  })
}
