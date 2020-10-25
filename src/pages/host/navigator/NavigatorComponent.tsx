import React, {useContext, useEffect} from "react";
import "./NavigatorComponent.scss";
import {HostContext} from "../state/HostContext";
import {useTreeState} from "react-hyper-tree";
import _ from "lodash";
import NavigationTree, {ITreeNode} from "../../../components/tree/NavigationTree";
import {getStateColor} from "../../../helpers/NodeHelper";

/**
 * Simple Navigator
 *
 * @param className
 */
export default ({className}: { className: string }) =>
{
  const {state} = useContext(HostContext)
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
    <div className={(className || "") + " navigator__container"}>
      <NavigationTree required={required} handlers={handlers}/>
    </div>
  );
}
