import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import './NetworkComponent.scss'
import {deviceToNode, edgeToEdge, NetworkGraph} from "./NetworkGraph";
import {useGlobalHook} from "@devhammed/use-global-hook";
import {DataSet} from "vis-network/standalone/esm/vis-network";
import ToolbarComponent from "../toolbar/NetworkToolbarComponent";
import DeviceInspectionDialogContent from "../dialogs/DeviceInspectionDialogContent";
import AddComponent from "../toolbar/AddComponent";
import {IDialogStore} from "../../../types/dialog";
import {DataSetEdges, DataSetNodes, Edge, Node} from "vis-network/dist/types";
import {Position} from "vis-network/declarations/network/Network";
import {IDevice} from "../../../types/model";
import RemoveComponent from "../toolbar/RemoveComponent";
import {ACTION_ADD_EDGE_BETWEEN, ACTION_CREATE_DEVICE, ACTION_REMOVE_DEVICE, ACTION_REMOVE_EDGE_BETWEEN, ACTION_UPDATE_DEVICE, HostContext, HostDispatch} from "../state/HostContext";
import AutoRefreshComponent from "../toolbar/AutoRefreshComponent";
import SelectionDetailsComponent from "../details/SelectionDetailsComponent";
import _ from "lodash";
import {useCallbackNoRefresh} from "../../../helpers/Utility";
import {getStateColor} from "../../../helpers/NodeHelper";

/**
 * Component that will render the netplan chart as a network diagram
 *
 * @param className CSS classes
 * @param hostID ID of the host
 */
export default ({className, hostID}: { className?: string, hostID: string }) =>
{
  const {state, dispatch} = useContext(HostContext);
  const {showDialog} = useGlobalHook("dialogStore") as IDialogStore;
  const nodesRef = useRef<DataSetNodes>(new DataSet());
  const edgesRef = useRef<DataSetEdges>(new DataSet());
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  /**
   * Function to refresh the current nodes / edges
   */
  useEffect(() =>
  {
    const usedNodeIDs: any[] = [];
    const usedEdgeIDs: any[] = [];

    // Add / Update currently available devices
    state.devices?.forEach(pDevice =>
    {

      // Update Node
      const node = deviceToNode(pDevice, getStateColor(pDevice.metrics));
      usedNodeIDs.push(node.id);
      nodesRef.current.update(node);

      // Update Edges
      pDevice.edges?.forEach(pEdge =>
      {
        const edge = edgeToEdge(pEdge);
        usedEdgeIDs.push(edge.id);
        edgesRef.current.update(edge);
      })
    })

    // Remove unused nodes
    nodesRef.current.stream()
      .filter((pNode: Node) => usedNodeIDs.indexOf(pNode.id) === -1)
      .forEach(((pNode: Node) => nodesRef.current.remove(pNode.id)));

    // Remove unused edges
    edgesRef.current.stream()
      .filter((pEdge: Edge) => usedEdgeIDs.indexOf(pEdge.id) === -1)
      .forEach(((pEdge: Edge) => edgesRef.current.remove(pEdge.id)));
  }, [state, dispatch, hostID]);

  // Keyboard-Events
  useEffect(() =>
  {
    const listener = (event: KeyboardEvent) =>
    {
      if (event.keyCode === 46)
        _handleDelete(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, dispatch)
      else if (event.key === "a")
        _handleCreate(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, hostID, dispatch)
    };
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener);
  }, [selectedNodes, selectedEdges, dispatch, hostID])

  // Create the double click function, but without retriggering a refresh, if it changes
  const onDoubleClickRef = useCallbackNoRefresh(() => (pNodeIDs: string[]) =>
  {
    if (!state.devices)
      return;
    _nodesDoubleClicked(state.devices.filter(pDevice => pNodeIDs.indexOf(pDevice.id) > -1), showDialog, dispatch)
  }, [state.devices, showDialog, dispatch])

  // Create the network graph once
  const graph = useMemo(() => (
    <NetworkGraph nodes={nodesRef.current} edges={edgesRef.current} onMove={pPos => _nodesMoved(pPos, dispatch)}
                  onDoubleClick={pNodeIDs => onDoubleClickRef.current(pNodeIDs)}
                  onSelectionChanged={(nodes, edges) =>
                  {
                    if (nodes)
                      setSelectedNodes(nodes);
                    if (edges)
                      setSelectedEdges(edges)
                  }}
                  onDragStart={() => {}} onDragEnd={() => {}}/>
  ), [setSelectedNodes, dispatch, onDoubleClickRef]);

  return (
    <div className={(className || "") + " graph-container"}>
      <ToolbarComponent>
        <AutoRefreshComponent/>
        <AddComponent enabled={true}
                      onClick={() => _handleCreate(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, hostID, dispatch)}/>
        <RemoveComponent enabled={(selectedNodes.length + selectedEdges.length) > 0}
                         onClick={() => _handleDelete(nodesRef.current, edgesRef.current, selectedNodes, selectedEdges, dispatch)}/>
      </ToolbarComponent>
      {graph}
      <SelectionDetailsComponent pNode={_.head(state.devices?.filter(pDevice => selectedNodes.indexOf(pDevice.id) > -1))}/>
    </div>
  );
}

/**
 * This method gets called, if the positions of nodes
 * have been moved and should be updated on remote
 *
 * @param pPositions Object with {nodeID: {x: 99, y: 99}}
 * @param pDispatchFn Function to dispatch actions
 * @private
 */
function _nodesMoved(pPositions: { [nodeID: string]: Position }, pDispatchFn: HostDispatch)
{
  Object.keys(pPositions).forEach(pNodeID => pDispatchFn(ACTION_UPDATE_DEVICE(pNodeID, {
    id: pNodeID,
    location: pPositions[pNodeID],
  })));
}

/**
 * This method gets called, if nodes were double clicked
 *
 * @param pNodes Nodes that were double clicked. Mostly a single node.
 * @param pShowDialogFn Function that will show a simple dialog
 * @param pDispatchFn Function to dispatch actions
 * @private
 */
function _nodesDoubleClicked(pNodes: IDevice[], pShowDialogFn: (dialog: any) => void, pDispatchFn: HostDispatch)
{
  if (pNodes.length > 1)
    return;

  const device = pNodes[0];
  let changedProps: any = {id: device.id};

  // noinspection JSUnusedGlobalSymbols
  pShowDialogFn({
    primaryKey: "Save",
    title: "Modify Node '" + device.id + "'",
    children: <DeviceInspectionDialogContent onPropChange={(prop, value) => changedProps[prop] = value} device={device}/>,
    onResult: (pResultKey: string) =>
    {
      if (pResultKey === "Save")
        pDispatchFn(ACTION_UPDATE_DEVICE(device.id, changedProps))
    },
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
 * @param pDispatchFn Function to dispatch actions
 */
function _handleCreate(pCurrentNodes: DataSetNodes, pCurrentEdges: DataSetEdges,
                       pSelectedNodeIDs: string[], pSelectedEdgeIDs: string[], pHostID: string,
                       pDispatchFn: HostDispatch)
{
  if (pSelectedNodeIDs.length === 2)
    pDispatchFn(ACTION_ADD_EDGE_BETWEEN(pSelectedNodeIDs[0], pSelectedNodeIDs[1]))
  else if (pSelectedNodeIDs.length + pSelectedEdgeIDs.length === 0)
    pDispatchFn(ACTION_CREATE_DEVICE(pHostID))
}

/**
 * Handles a delete request
 *
 * @param pCurrentNodes Reference to the currently used nodes
 * @param pCurrentEdges Reference to the currently used edges
 * @param pSelectedNodeIDs string-array of the selected nodes ids
 * @param pSelectedEdgeIDs string-array of the selected edge ids
 * @param pDispatchFn Function to dispatch actions
 */
function _handleDelete(pCurrentNodes: DataSetNodes, pCurrentEdges: DataSetEdges,
                       pSelectedNodeIDs: string[], pSelectedEdgeIDs: string[],
                       pDispatchFn: HostDispatch)
{
  // Remove Nodes
  pSelectedNodeIDs.forEach(pNodeID =>
  {
    const node = pCurrentNodes.get(pNodeID);
    if (node)
      pDispatchFn(ACTION_REMOVE_DEVICE(node.id))
  })

  // Remove Edges
  pSelectedEdgeIDs.forEach(pEdgeID =>
  {
    const edge = pCurrentEdges.get(pEdgeID);
    if (edge)
      pDispatchFn(ACTION_REMOVE_EDGE_BETWEEN(edge.from as string, edge.to as string))
  })
}
