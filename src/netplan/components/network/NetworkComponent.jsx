import React, {useEffect, useMemo, useRef} from 'react';
import './NetworkComponent.scss'
import {deviceToEdge, deviceToNode, NetworkGraph} from "./NetworkGraph";
import {getAllDevices, getDeviceByID, updateDevice} from '../../rest/DeviceClient';
import {useGlobalHook} from "@devhammed/use-global-hook";
import ToolbarComponent from "./NetworkToolbarComponent";

// noinspection ES6CheckImport
import {DataSet} from "vis-network/standalone/esm/vis-network";
import AutoRefreshComponent from "./AutoRefreshComponent";

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
      getDeviceByID(pNodeID).then(pDevice =>
      {
        if (pDevice !== undefined)
        {
          pDevice.location = pPositions[pNodeID];
          pDevice.metrics = null;

          // noinspection JSIgnoredPromiseFromCall
          updateDevice(pDevice)
        }
      })
    })
}

/**
 * This method gets called, if nodes were double clicked
 *
 * @param pNodes Nodes that were double clicked. Mostly a single node.
 * @param pShowDialogFn Function that will show a simple dialog
 * @private
 */
function _nodesDoubleClicked(pNodes, pShowDialogFn)
{
  if (pNodes.size > 1)
    return;

  getDeviceByID(pNodes[0])
    .then(pDevice =>
    {
      pShowDialogFn({
        primaryKey: "Save",
        title: "Node",
        children: <pre>{JSON.stringify(pDevice, null, " ")}</pre>
      })
    })
}

/**
 * Component that will render the netplan chart as a network diagram
 */
export default () =>
{
  const {showDialog} = useGlobalHook("dialogStore");
  const nodesRef = useRef(new DataSet());
  const edgesRef = useRef(new DataSet());

  /**
   * Function to refresh the current nodes / edges
   */
  function _refresh()
  {
    getAllDevices().then((data) =>
    {
      if (!data)
        return;

      // noinspection JSUnresolvedFunction
      data.map(pDev => deviceToNode(pDev, _getStateColor(pDev)))
        .forEach(pNode => nodesRef.current.update(pNode))

      // noinspection JSUnresolvedFunction
      data.map(deviceToEdge)
        .forEach(pNode => edgesRef.current.update(pNode))
    });
  }

  // Load all devices into state on mount
  useEffect(() => _refresh(), [])

  // Create the network graph once
  const graph = useMemo(() => <NetworkGraph nodes={nodesRef.current}
                                            edges={edgesRef.current}
                                            onMove={_nodesMoved}
                                            onDoubleClick={pNodes => _nodesDoubleClicked(pNodes, showDialog)}/>, [showDialog]);

  return (
    <div className={"graph-container"}>
      <ToolbarComponent>
        <AutoRefreshComponent onTrigger={_refresh} interval={1000}/>
      </ToolbarComponent>
      {graph}
    </div>
  );
}

