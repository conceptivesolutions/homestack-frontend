import React, {useContext, useEffect} from "react";
import styles from "./NavigatorComponent.module.scss";
import {ACTION_CREATE_DEVICE, ACTION_REMOVE_DEVICE, EHostStateActions, HostContext, HostDispatch} from "../state/HostContext";
import {useTreeState} from "react-hyper-tree";
import _ from "lodash";
import NavigationTree, {ITreeNode} from "../../../components/tree/NavigationTree";
import {getStateColor} from "../../../helpers/NodeHelper";
import classNames from "classnames";
import ActionList from "../../../components/actionlist/ActionList";
import ActionListItem from "../../../components/actionlist/ActionListItem";

/**
 * Simple Navigator
 *
 * @param className
 */
export default ({className}: { className: string }) =>
{
  const {state, dispatch} = useContext(HostContext)
  const root: ITreeNode = {
    id: "root",
    name: "Devices & Results",
    iconName: "server",
    children: _.sortBy(state.devices || [], ['address', 'id']).map(pDevice => ({
      id: pDevice.id,
      name: pDevice.address || "unknown",
      iconName: "network-wired",
      iconColor: getStateColor(pDevice.metrics),
      selectable: true,
      onSelect: selected => _onSelect(pDevice.id, selected, dispatch),
      children: (pDevice.metrics || []).map(pMetric => ({
        id: pDevice.id + pMetric.type,
        name: pMetric.type + " => " + pMetric.state,
        iconName: "chart-pie",
        iconColor: getStateColor([pMetric]),
      }))
    }))
  };

  const {required, instance, handlers} = useTreeState({
    id: "deviceTree",
    multipleSelect: true,
    data: root,
  });

  // Always open root
  useEffect(() =>
  {
    handlers.setOpen("root")
  }, [handlers])

  // Selection
  useEffect(() =>
  {
    instance.unselectAll();
    state.selection?.devices?.forEach(pDeviceID => handlers.setSelected(pDeviceID, true))
  }, [state.selection, instance, handlers])

  return (
    <div className={classNames(className, styles.container)}>
      <NavigationTree className={styles.tree} required={required} instance={instance} handlers={handlers}/>
      <ActionList className={styles.actions}>
        <ActionListItem name={"Add Device"} iconName={"plus-circle"} onClick={() => dispatch(ACTION_CREATE_DEVICE())}/>
        <ActionListItem disabled={_.isEmpty(state.selection?.devices)} name={"Remove Device"} iconName={"minus-circle"}
                        color={"red"} onClick={() => state.selection?.devices?.forEach(pDevID => dispatch(ACTION_REMOVE_DEVICE(pDevID)))}/>
      </ActionList>
    </div>
  );
}

function _onSelect(nodeID: string, selected: boolean, dispatch: HostDispatch)
{
  if (selected)
    dispatch({
      type: EHostStateActions.SET_SELECTION, payload: {
        devices: [nodeID]
      }
    });
}
