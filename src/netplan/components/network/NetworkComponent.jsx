import React, {useEffect, useMemo, useRef, useState} from 'react';
import './NetworkComponent.scss'
import {deviceToEdge, deviceToNode, NetworkGraph} from "./NetworkGraph";
import {getAllDevices, getDeviceByID, updateDevice} from '../../rest/DeviceClient';
import {useGlobalHook} from "@devhammed/use-global-hook";
import {DataSet} from "vis-network/standalone/esm/vis-network";
import ToolbarComponent from "./toolbar/NetworkToolbarComponent";
import AutoRefreshComponent from "./toolbar/AutoRefreshComponent";
import DeviceInspectionDialogContent from "./dialogs/DeviceInspectionDialogContent";
import AddEdgeComponent from "./toolbar/AddComponent";

/**
 * Component that will render the netplan chart as a network diagram
 */
export default () =>
{
  const {showDialog} = useGlobalHook("dialogStore");
  const canRefresh = useRef(true);
  const nodesRef = useRef(new DataSet());
  const edgesRef = useRef(new DataSet());
  const [selectedNodes, setSelectedNodes] = useState([]);

  /**
   * Function to refresh the current nodes / edges
   */
  function _refresh()
  {
    // We are not able to refresh currently
    if (!canRefresh.current)
      return;

    getAllDevices().then((data) =>
    {
      if (!data || !canRefresh.current)
        return;

      // noinspection JSUnresolvedFunction
      data.map(pDev => deviceToNode(pDev, _getStateColor(pDev)))
        .forEach(pNode => nodesRef.current.update(pNode))

      // noinspection JSUnresolvedFunction
      data.map(deviceToEdge)
        .forEach(pNode => edgesRef.current.update(pNode))

      // Clear selection, because we do not have anything selected after updating
      setSelectedNodes([])
    });
  }

  // Load all devices into state on mount
  useEffect(() => _refresh(), [])

  // Create the network graph once
  const graph = useMemo(() => (
    <NetworkGraph nodes={nodesRef.current} edges={edgesRef.current}
                  onMove={_nodesMoved} onDoubleClick={pNodes => _nodesDoubleClicked(pNodes, showDialog, _refresh)}
                  onSelectionChanged={pNodes => setSelectedNodes(pNodes)}
                  onDragStart={() => canRefresh.current = false} onDragEnd={() => canRefresh.current = true}/>
  ), [showDialog, setSelectedNodes]);

  return (
    <div className={"graph-container"}>
      <ToolbarComponent>
        <AutoRefreshComponent onTrigger={_refresh} interval={1000}/>
        <AddEdgeComponent enabled={selectedNodes.length === 2} onClick={() => _addEdgeBetweenNode(selectedNodes[0], selectedNodes[1], _refresh)}/>
      </ToolbarComponent>
      {graph}
    </div>
  );
}

/**
 * Returns the color for a given device state
 *
 * @param pDevice device to check
 * @returns {string} color als hex string
 * @private
 */
function _getStateColor(pDevice)
{
  if (pDevice.metrics === undefined)
    return "#737373";

  let failed = [];
  let success = [];

  pDevice.metrics.forEach(pMetric =>
  {
    if (pMetric.state === "SUCCESS")
      success.push(pMetric);
    else
      failed.push(pMetric);
  })

  if (failed.length > 0 && success.length === 0)
    return "#dd0404";
  else if (failed.length > 0 && success.length > 0)
    return "#fffb03";
  else
    return "#4bbf04"
}

/**
 * This method gets called, if the positions of nodes
 * have been moved and should be updated on remote
 *
 * @param pPositions Object with {nodeID: {x: 99, y: 99}}
 * @private
 */
function _nodesMoved(pPositions)
{
  Object.keys(pPositions)
    .forEach(pNodeID =>
    {
      updateDevice(pNodeID, {
        location: pPositions[pNodeID],
      })
    })
}

/**
 * This method gets called, if nodes were double clicked
 *
 * @param pNodes Nodes that were double clicked. Mostly a single node.
 * @param pShowDialogFn Function that will show a simple dialog
 * @param pRefreshFn Function that will refresh the whole network
 * @private
 */
function _nodesDoubleClicked(pNodes, pShowDialogFn, pRefreshFn)
{
  if (pNodes.size > 1)
    return;

  const id = pNodes[0];
  getDeviceByID(id)
    .then(pDevice =>
    {
      let changedProps = {};
      const primaryKey = "Save";

      const onResultFn = pResult =>
      {
        if (pResult === primaryKey)
          updateDevice(id, changedProps)
            .then(() => pRefreshFn())
      }

      // noinspection JSUnusedGlobalSymbols
      pShowDialogFn({
        primaryKey: primaryKey,
        title: "Modify Node '" + id + "'",
        children: <DeviceInspectionDialogContent onPropChange={(prop, value) => changedProps[prop] = value} device={pDevice}/>,
        onResult: onResultFn,
      })
    })
}

/**
 * Adds a new edge between node1 and node2
 *
 * @param pNode1ID ID of the first node
 * @param pNode2ID ID of the second node
 * @param pRefreshFn Function that will refresh the whole network
 * @private
 */
function _addEdgeBetweenNode(pNode1ID, pNode2ID, pRefreshFn)
{
  updateDevice(pNode1ID, {edges: [{deviceID: pNode2ID}]})
    .then(() => pRefreshFn())
}
