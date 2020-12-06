import {mdiChartBar, mdiDevices, mdiMonitor, mdiPencilOutline, mdiPlusCircle, mdiPlusCircleOutline, mdiSatellite, mdiSatelliteUplink} from "@mdi/js";
import classNames from "classnames";
import ActionList from "components/actionlist/ActionList";
import ActionListItem from "components/actionlist/ActionListItem";
import NavigationTree, {ITreeNode} from "components/tree/NavigationTree";
import {ACTION_CREATE_DEVICE, StackContext} from "context/StackContext";
import {iconToSVG} from "helpers/iconHelper";
import {getStateColor} from "helpers/NodeHelper";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext, useEffect} from "react";
import {useTreeState} from "react-hyper-tree";
import {v4 as uuidv4} from 'uuid';
import styles from "widgets/navigator/StackNavigatorComponent.module.scss";

/**
 * Simple Navigator for a single stack
 */
const StackNavigatorComponent = () =>
{
  const {state, dispatch} = useContext(StackContext)
  const router = useRouter();
  const root: ITreeNode[] = [{
    id: "satellites",
    name: "Satellites",
    icon: mdiSatellite,
    children: _.sortBy(state.satellites || [], ['id']).map(pSatellite => ({
      id: pSatellite.id,
      name: pSatellite.id,
      icon: mdiSatelliteUplink,
      hoverIcon: mdiPencilOutline,
      hoverIconClick: () => router.push(router.asPath + "/satellites/" + pSatellite.id)
    }))
  }, {
    id: "root",
    name: "Devices",
    icon: mdiDevices,
    children: _.sortBy(state.devices || [], ['address', 'id']).map(pDevice => ({
      id: pDevice.id,
      name: pDevice.address || "unknown",
      icon: pDevice.icon && iconToSVG(pDevice.icon) || mdiMonitor,
      iconColor: getStateColor(pDevice.metricRecords),
      linkTo: router.asPath + "/devices/" + pDevice.id,
      children: (pDevice.metricRecords || []).map(pRecord => ({
        id: pDevice.id + pRecord.type,
        name: pRecord.type + " => " + pRecord.state,
        icon: mdiChartBar,
        iconColor: getStateColor([pRecord]),
      }))
    }))
  }];

  const {required, instance, handlers} = useTreeState({
    id: "deviceTree",
    multipleSelect: true,
    data: root,
  });

  // Always open root
  useEffect(() =>
  {
    handlers.setOpen("satellites")
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

export default StackNavigatorComponent;
