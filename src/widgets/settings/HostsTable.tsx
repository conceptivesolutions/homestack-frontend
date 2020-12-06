import {mdiCogOutline, mdiPlus, mdiTrashCanOutline} from "@mdi/js";
import Icon from "@mdi/react";
import _ from "lodash";
import React, {useContext} from "react";
import {ACTION_CREATE_STACK, ACTION_REMOVE_STACK, ACTION_UPDATE_STACK, GlobalContext} from "../../context/GlobalContext";
import styles from "./HostsTable.module.scss"

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
        {_.sortBy(state.stacks, ['displayName', 'id']).map(pHost => <tr key={pHost.id}>
          <td>{pHost.id}</td>
          <td className={styles.hostsTable__name}>{pHost.displayName}</td>
          <td>
            <button onClick={() =>
            {
              const name = prompt("New Name:", pHost.displayName);
              if (name && name !== pHost.displayName)
                dispatch(ACTION_UPDATE_STACK({
                  ...pHost,
                  displayName: name || "",
                }))
            }}>
              <Icon path={mdiCogOutline} size={0.8}/>
            </button>
            <button onClick={() => dispatch(ACTION_REMOVE_STACK(pHost.id))}>
              <Icon path={mdiTrashCanOutline} size={0.8}/>
            </button>
          </td>
        </tr>)}
        </tbody>
      </table>
      <button onClick={() => dispatch(ACTION_CREATE_STACK())}>
        <Icon path={mdiPlus} size={0.8}/>
      </button>
    </>
  )
}

export default HostsTable;
