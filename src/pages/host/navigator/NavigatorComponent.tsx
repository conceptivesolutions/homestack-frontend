import React, {useContext} from "react";
import "./NavigatorComponent.scss";
import {HostContext} from "../state/HostContext";
import {useTreeState} from "react-hyper-tree";
import _ from "lodash";
import NavigationTree from "../../../components/tree/NavigationTree";

/**
 * Simple Navigator
 *
 * @param className
 */
export default ({className}: { className: string }) =>
{
  const {state} = useContext(HostContext)
  const {required, handlers} = useTreeState({
    id: "deviceTree",
    multipleSelect: false,
    defaultOpened: true,
    data: {
      id: "root",
      name: "Devices & Results",
      iconName: "server",
      children: _.sortBy(state.devices || [], ['address', 'id']).map(pDevice => ({
        id: pDevice.id,
        name: pDevice.address || "unknown",
        iconName: "network-wired",
        children: (pDevice.metrics || []).map(pMetric => ({
          id: pDevice.id + pMetric.type,
          name: pMetric.type + " => " + pMetric.state,
          iconName: "chart-pie",
        }))
      }))
    }
  });

  return (
    <div className={(className || "") + " navigator__container"}>
      <NavigationTree required={required} handlers={handlers}/>
    </div>
  );
}
