import React, {useContext, useEffect} from "react";
import "./NavigatorComponent.scss";
import {ACTION_CREATE_DEVICE, ACTION_REMOVE_DEVICE, HostContext} from "../state/HostContext";
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
      children: (pDevice.metrics || []).map(pMetric => ({
        id: pDevice.id + pMetric.type,
        name: pMetric.type + " => " + pMetric.state,
        iconName: "chart-pie",
        iconColor: getStateColor([pMetric]),
      }))
    }))
  };

  const {required, handlers} = useTreeState({
    id: "deviceTree",
    multipleSelect: false,
    data: root,
  });

  useEffect(() =>
  {
    handlers.setOpen("root")
  }, [handlers])

  return (
    <div className={classNames(className, "navigator__container")}>
      <NavigationTree className={"navigator__tree"} required={required} handlers={handlers}/>
      <ActionList className={"navigator__actions"}>
        <ActionListItem name={"Add Device"} iconName={"plus-circle"} onClick={() => dispatch(ACTION_CREATE_DEVICE())}/>
        <ActionListItem disabled={_.isEmpty(state.selection?.devices)} name={"Remove Device"} iconName={"minus-circle"}
                        color={"red"} onClick={() => state.selection?.devices.forEach(pDevID => dispatch(ACTION_REMOVE_DEVICE(pDevID)))}/>
      </ActionList>
    </div>
  );
}
