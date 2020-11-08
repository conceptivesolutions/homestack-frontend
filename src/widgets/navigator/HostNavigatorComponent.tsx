import React, {useContext, useEffect} from "react";
import styles from "./HostNavigatorComponent.module.scss";
import {ACTION_CREATE_DEVICE, EHostStateActions, HostContext, HostDispatch} from "../../context/HostContext";
import {useTreeState} from "react-hyper-tree";
import _ from "lodash";
import NavigationTree, {ITreeNode} from "../../components/tree/NavigationTree";
import {getStateColor} from "../../helpers/NodeHelper";
import classNames from "classnames";
import ActionList from "../../components/actionlist/ActionList";
import ActionListItem from "../../components/actionlist/ActionListItem";
import {mdiChartBar, mdiMonitor, mdiPencilOutline, mdiPlusCircle, mdiServer} from "@mdi/js";
import {iconToSVG} from "../../helpers/iconHelper";
import {useRouter} from "next/router";
import {v4 as uuidv4} from 'uuid';

/**
 * Simple Navigator for a single host
 */
const HostNavigatorComponent = () =>
{
  const {state, dispatch} = useContext(HostContext)
  const router = useRouter();
  const root: ITreeNode = {
    id: "root",
    name: "Devices & Results",
    icon: mdiServer,
    children: _.sortBy(state.devices || [], ['address', 'id']).map(pDevice => ({
      id: pDevice.id,
      name: pDevice.address || "unknown",
      icon: pDevice.icon && iconToSVG(pDevice.icon) || mdiMonitor,
      iconColor: getStateColor(pDevice.metricRecords),
      hoverIcon: mdiPencilOutline,
      hoverIconClick: () => router.push(router.asPath + "/devices/" + pDevice.id),
      selectable: true,
      onSelect: selected => _onSelect(pDevice.id, selected, dispatch),
      children: (pDevice.metricRecords || []).map(pRecord => ({
        id: pDevice.id + pRecord.type,
        name: pRecord.type + " => " + pRecord.state,
        icon: mdiChartBar,
        iconColor: getStateColor([pRecord]),
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
  useEffect(() => instance.traverse((node) => handlers.setSelected(node.id, _.indexOf(state.selection?.devices, node.id as string) > -1), true),
    [state.selection, instance, handlers])

  return (
    <div className={classNames(styles.container)}>
      <NavigationTree className={styles.tree} required={required} instance={instance} handlers={handlers}/>
      <ActionList className={styles.actions}>
        <ActionListItem name={"Add Device"} icon={mdiPlusCircle}
                        onClick={() => dispatch(ACTION_CREATE_DEVICE(uuidv4(), (pID) => router.push(router.asPath + "/devices/" + pID)))}/>
      </ActionList>
    </div>
  );
};

export default HostNavigatorComponent;

function _onSelect(nodeID: string, selected: boolean, dispatch: HostDispatch)
{
  if (selected)
    dispatch({
      type: EHostStateActions.SET_SELECTION, payload: {
        devices: [nodeID]
      }
    });
}
