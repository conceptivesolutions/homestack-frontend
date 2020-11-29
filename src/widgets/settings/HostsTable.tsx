import React, {useContext} from "react";
import styles from "./HostsTable.module.scss"
import _ from "lodash";
import {ACTION_CREATE_HOST, ACTION_REMOVE_HOST, ACTION_UPDATE_HOST, GlobalContext} from "../../context/GlobalContext";
import Icon from "@mdi/react";
import {mdiCogOutline, mdiPlus, mdiTrashCanOutline} from "@mdi/js";

const HostsTable = () =>
{
  const {state, dispatch} = useContext(GlobalContext);

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
            <button onClick={() =>
            {
              const name = prompt("New Name:", pHost.displayName);
              if (name && name !== pHost.displayName)
                dispatch(ACTION_UPDATE_HOST({
                  ...pHost,
                  displayName: name || "",
                }))
            }}>
              <Icon path={mdiCogOutline} size={0.8}/>
            </button>
            <button onClick={() => dispatch(ACTION_REMOVE_HOST(pHost.id))}>
              <Icon path={mdiTrashCanOutline} size={0.8}/>
            </button>
          </td>
        </tr>)}
        </tbody>
      </table>
      <button onClick={() => dispatch(ACTION_CREATE_HOST())}>
        <Icon path={mdiPlus} size={0.8}/>
      </button>
    </>
  )
}

export default HostsTable;
