import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './NetworkComponent.scss'
import {deviceToNode, edgeToEdge, NetworkGraph} from "./NetworkGraph";
import {createDevice, deleteDevice, getAllDevices, getDeviceByID, updateDevice} from '../../rest/DeviceClient';
import {useGlobalHook} from "@devhammed/use-global-hook";
import {DataSet} from "vis-network/standalone/esm/vis-network";
import ToolbarComponent from "./toolbar/NetworkToolbarComponent";
import AutoRefreshComponent from "./toolbar/AutoRefreshComponent";
import DeviceInspectionDialogContent from "./dialogs/DeviceInspectionDialogContent";
import AddComponent from "./toolbar/AddComponent";
import {addEdgeBetween, getEdges, removeEdgeBetween} from "../../rest/EdgeClient";
import {getMetrics} from "../../rest/MetricsClient";
import {IDialogStore} from "../../types/dialog";
import {DataSetEdges, DataSetNodes, Edge, Node} from "vis-network/dist/types";
import {Position} from "vis-network/declarations/network/Network";
import {EMetricState, IMetric} from "../../types/model";
import RemoveComponent from "./toolbar/RemoveComponent";
import {v4 as uuidv4} from 'uuid';
import {useParams} from "react-router";
import LoadingIndicator from "../loader/LoadingIndicator";
import {useAuth0} from "@auth0/auth0-react";

/**
 * Component that will render the netplan chart as a network diagram
 */
export default () =>
{
  const {showDialog} = useGlobalHook("dialogStore") as IDialogStore;
  const canRefresh = useRef<boolean>(true);
  const nodesRef = useRef<DataSetNodes>(new DataSet());
  const edgesRef = useRef<DataSetEdges>(new DataSet());
  const {hostID} = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const {getAccessTokenSilently} = useAuth0();

  /**
   * Function to execute a promise with the "global" loading indicator
   *
   * @param pFn Promise that gets executed
   */
  function _withLoadingIndicator(pFn: Promise<any>)
  {
    setLoading(true)
    pFn.finally(() => setLoading(false));
  }

  /**
   * Function to refresh the current nodes / edges
   */
  const _refresh = useCallback(() =>
  {
    // We are not able to refresh currently
    if (!canRefresh.current)
      return Promise.resolve();

    return getAccessTokenSilently()
      .then(pToken => getAllDevices(pToken, hostID))
      .then((data) =>
      {
        if (!data || !canRefresh.current)
          return;

        const usedNodeIDs: any[] = [];
        const usedEdgeIDs: any[] = [];

        // Update all current IDs (incl. add)
        getAccessTokenSilently()
          .then(pToken => Promise.all(data
            .map(pDevice => Promise.all([getMetrics(pToken, pDevice.id), getEdges(pToken, pDevice.id)])
              .then((values) =>
              {
                // Update Node
                const node = deviceToNode(pDevice, _getStateColor(values[0]));
                usedNodeIDs.push(node.id);
                nodesRef.current.update(node);

                // Update Edges
                values[1].forEach(pEdge =>
                {
                  const edge = edgeToEdge(pEdge);
                  usedEdgeIDs.push(edge.id);
                  edgesRef.current.update(edge)
                });
              }))))

          // Remove unused objects
          .then(() =>
          {
            // Remove unused nodes
            nodesRef.current.stream()
              .filter((pNode: Node) => usedNodeIDs.indexOf(pNode.id) === -1)
              .forEach(((pNode: Node) =>
              {
                nodesRef.current.remove(pNode.id)
              }));
            // Remove unused edges
            edgesRef.current.stream()
              .filter((pEdge: Edge) => usedEdgeIDs.indexOf(pEdge.id) === -1)
              .forEach(((pEdge: Edge) =>
              {
                edgesRef.current.remove(pEdge.id)
              }));
          })
      });
  }, [getAccessTokenSilently, hostID]);

  // Keyboard-Events
  useEffect(() =>
  {
    const listener = (event: KeyboardEvent) =>
    {
      if (event.keyCode === 46)
        _handleDelete(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, getAccessTokenSilently, _refresh)
      else if (event.key === "a")
        _handleCreate(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, hostID, getAccessTokenSilently, _refresh)
    };
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener);
  }, [selectedNodes, selectedEdges, getAccessTokenSilently, hostID, _refresh])

  // Load all devices into state on mount
  useEffect(() =>
  {
    _withLoadingIndicator(_refresh())
  }, [getAccessTokenSilently, _refresh])

  // Create the network graph once
  const graph = useMemo(() => (
    <NetworkGraph nodes={nodesRef.current} edges={edgesRef.current} onMove={pPos => _nodesMoved(getAccessTokenSilently, pPos)}
                  onDoubleClick={pNodes => _nodesDoubleClicked(pNodes, showDialog, getAccessTokenSilently, _refresh)}
                  onSelectionChanged={(nodes, edges) =>
                  {
                    if (nodes)
                      setSelectedNodes(nodes);
                    if (edges)
                      setSelectedEdges(edges)
                  }}
                  onDragStart={() => canRefresh.current = false} onDragEnd={() => canRefresh.current = true}/>
  ), [showDialog, setSelectedNodes, getAccessTokenSilently, _refresh]);

  if (loading)
    return <LoadingIndicator/>

  return (
    <div className={"graph-container"}>
      <ToolbarComponent>
        <AutoRefreshComponent onTrigger={_refresh} interval={1000}/>
        <AddComponent enabled={true}
                      onClick={() => _handleCreate(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, hostID, getAccessTokenSilently, _refresh)}/>
        <RemoveComponent enabled={(selectedNodes.length + selectedEdges.length) > 0}
                         onClick={() => _handleDelete(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, getAccessTokenSilently, _refresh)}/>
      </ToolbarComponent>
      {graph}
    </div>
  );
}

/**
 * Returns the color for a given device state
 *
 * @param pMetrics metrics to read
 * @returns {string} color als hex string
 * @private
 */
function _getStateColor(pMetrics: IMetric[])
{
  if (pMetrics === undefined)
    return "#737373";

  let failed = [];
  let success = [];

  pMetrics.forEach(pMetric =>
  {
    if (pMetric.state === EMetricState.SUCCESS)
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
 * @param pTokenFn Function to retrieve the current access token
 * @param pPositions Object with {nodeID: {x: 99, y: 99}}
 * @private
 */
function _nodesMoved(pTokenFn: () => Promise<string>, pPositions: { [nodeID: string]: Position })
{
  pTokenFn().then(pToken => Object.keys(pPositions)
    .forEach(pNodeID =>
    {
      updateDevice(pToken, pNodeID, {
        id: pNodeID,
        location: pPositions[pNodeID],
      })
    }))
}

/**
 * This method gets called, if nodes were double clicked
 *
 * @param pNodes Nodes that were double clicked. Mostly a single node.
 * @param pShowDialogFn Function that will show a simple dialog
 * @param pTokenFn Function to retrieve the current access token
 * @param pRefreshFn Function that will refresh the whole network
 * @private
 */
function _nodesDoubleClicked(pNodes: string[], pShowDialogFn: (dialog: any) => void, pTokenFn: () => Promise<string>, pRefreshFn: () => void)
{
  if (pNodes.length > 1)
    return;

  const id = pNodes[0];
  pTokenFn()
    .then(pToken => getDeviceByID(pToken, id))
    .then(pDevice =>
    {
      let changedProps: any = {id};
      const primaryKey = "Save";

      const onResultFn = (pResult: string) =>
      {
        if (pResult === primaryKey)
          pTokenFn()
            .then(pToken => updateDevice(pToken, id, changedProps))
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
 * Handles a create request
 *
 * @param pCurrentNodes Reference to the currently used nodes
 * @param pCurrentEdges Reference to the currently used edges
 * @param pSelectedNodeIDs string-array of the selected nodes ids
 * @param pSelectedEdgeIDs string-array of the selected edge ids
 * @param pHostID ID of the host to create the device in
 * @param pTokenFn Function to retrieve the current access token
 * @param pRefreshFn Function to refresh the network component
 */
function _handleCreate(pCurrentNodes: DataSetNodes, pCurrentEdges: DataSetEdges,
                       pSelectedNodeIDs: string[], pSelectedEdgeIDs: string[], pHostID: string,
                       pTokenFn: () => Promise<string>, pRefreshFn: () => void)
{
  if (pSelectedNodeIDs.length === 2)
    pTokenFn()
      .then(pToken => addEdgeBetween(pToken, pSelectedNodeIDs[0], pSelectedNodeIDs[1]))
      .then(() => pRefreshFn())
  else if (pSelectedNodeIDs.length + pSelectedEdgeIDs.length === 0)
    pTokenFn()
      .then(pToken => createDevice(pToken, uuidv4(), pHostID))
      .then(() => pRefreshFn())
}

/**
 * Handles a delete request
 *
 * @param pCurrentNodes Reference to the currently used nodes
 * @param pCurrentEdges Reference to the currently used edges
 * @param pSelectedNodeIDs string-array of the selected nodes ids
 * @param pSelectedEdgeIDs string-array of the selected edge ids
 * @param pTokenFn Function to retrieve the current access token
 * @param pRefreshFn Function to refresh the network component
 */
function _handleDelete(pCurrentNodes: DataSetNodes, pCurrentEdges: DataSetEdges,
                       pSelectedNodeIDs: string[], pSelectedEdgeIDs: string[], pTokenFn: () => Promise<string>, pRefreshFn: () => void)
{
  // Remove Nodes
  const nodeRemovePromises: Promise<any>[] = pSelectedNodeIDs.map(pNodeIDToRemove => pCurrentNodes.get(pNodeIDToRemove))
    .filter(pNode => !!pNode)
    .map(pNode => pTokenFn().then(pToken => deleteDevice(pToken, pNode.id)))

  // Remove Edges
  const edgeRemovePromises: Promise<any>[] = pSelectedEdgeIDs.map(pEdgeIDToRemove => pCurrentEdges.get(pEdgeIDToRemove))
    .filter(pEdge => !!pEdge)
    .map(pEdge => pTokenFn().then(pToken => removeEdgeBetween(pToken, pEdge.from as string, pEdge.to as string)))

  // Refresh, if necessary and finished
  if (nodeRemovePromises.length + edgeRemovePromises.length > 0)
    Promise.all(nodeRemovePromises.concat(edgeRemovePromises)).then(pRefreshFn)
}
