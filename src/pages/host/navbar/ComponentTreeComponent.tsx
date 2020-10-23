import React, {useContext} from "react";
import "./ComponentTreeComponent.scss";
import {HostContext} from "../state/HostContext";
import Tree, {DefaultNode, useTreeState} from "react-hyper-tree";
import _ from "lodash";

export default ({className}: { className?: string }) =>
{
  const {state} = useContext(HostContext)
  const {required, handlers} = useTreeState({
    id: "deviceTree",
    multipleSelect: false,
    data: _.sortBy(state.devices || [], ['address', 'id']).map(pDevice => ({
      id: pDevice.id,
      name: pDevice.address || "unknown",
      iconName: "network-wired",
      children: _.toPairs(_.groupBy(pDevice.metrics || [], 'type')).map(pPair => ({
        id: pDevice.id + pPair[0],
        name: pPair[0],
        iconName: "chart-pie",
        children: (pDevice.metrics || [])
          .filter(pMetric => pMetric.type === pPair[0])
          .map(pMetric => ({
            id: pDevice.id + pPair[0] + pMetric.state,
            name: pMetric.state,
            iconName: "chart-pie",
          }))
      }))
    }))
  });

  return (
    <div className={(className || "") + " component-tree__container unselectable"}>
      <Tree
        {...required}
        {...handlers}
        disableTransitions
        depthGap={20}
        disableLines={true}
        draggable={false}
        renderNode={({node, onSelect, onToggle}) => <DefaultNode
          // @ts-ignore
          displayedName={(node) => <div className={"component-tree__node"} key={node.data.id}>
            {node.data.iconName && <span className={"component-tree__node-icon fa fa-" + node.data.iconName}/>}
            <span className={"component-tree__node-text"}>{node.data.name}</span>
          </div>}
          node={node}
          onSelect={onSelect}
          onToggle={onToggle}
        />}
      />
    </div>
  );
}
