import {mdiCogOutline, mdiPlus, mdiTrashCanOutline} from "@mdi/js";
import Icon from "@mdi/react";
import {ACTION_CREATE_STACK, ACTION_REMOVE_STACK, ACTION_UPDATE_STACK, GlobalContext} from "context/GlobalContext";
import _ from "lodash";
import React, {useContext} from "react";
import styles from "widgets/settings/StacksTable.module.scss"

const StacksTable = () =>
{
  const {state, dispatch} = useContext(GlobalContext);

  return (
    <>
      <table className={styles.stacksTable}>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th/>
        </tr>
        </thead>
        <tbody>
        {_.sortBy(state.stacks, ['displayName', 'id']).map(pStack => <tr key={pStack.id}>
          <td>{pStack.id}</td>
          <td className={styles.name}>{pStack.displayName}</td>
          <td>
            <button onClick={() =>
            {
              const name = prompt("New Name:", pStack.displayName);
              if (name && name !== pStack.displayName)
                dispatch(ACTION_UPDATE_STACK({
                  ...pStack,
                  displayName: name || "",
                }))
            }}>
              <Icon path={mdiCogOutline} size={0.8}/>
            </button>
            <button onClick={() => dispatch(ACTION_REMOVE_STACK(pStack.id))}>
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

export default StacksTable;
