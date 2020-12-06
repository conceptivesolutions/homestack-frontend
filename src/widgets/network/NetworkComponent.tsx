import classNames from "classnames";
import {ACTION_ADD_EDGE_BETWEEN, ACTION_RELOAD, ACTION_REMOVE_EDGE_BETWEEN, ACTION_UPDATE_DEVICE, EStackStateActions, StackContext, StackDispatch} from "context/StackContext";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {Position} from "vis-network/declarations/network/Network";
import {DataSet, DataSetEdges, DataSetNodes, Edge, Network, Node} from "vis-network/standalone/umd/vis-network";
import {getStateColor} from "../../helpers/NodeHelper";
import {useCallbackNoRefresh} from "../../helpers/Utility";
import styles from "./NetworkComponent.module.scss";
import {deviceToNode, edgeToEdge, NetworkGraph} from "./NetworkGraph";

/**
 * Component that will render the homestack chart as a network diagram
 *
 * @param className CSS classes
 * @param hostID ID of the host
 */
const NetworkComponent = ({className, hostID}: { className?: string, hostID: string }) =>
{
  const {state, dispatch} = useContext(StackContext);
  const router = useRouter();
  const nodesRef = useRef<DataSetNodes>(new DataSet());
  const edgesRef = useRef<DataSetEdges>(new DataSet());
  const networkRef = useRef<Network | undefined>();

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
      const node = deviceToNode(pDevice, getStateColor(pDevice.metricRecords));
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
      .toItemArray()
      .forEach(((pNode: Node) => nodesRef.current.remove(pNode.id as string)));

    // Remove unused edges
    edgesRef.current.stream()
      .filter((pEdge: Edge) => usedEdgeIDs.indexOf(pEdge.id) === -1)
      .toItemArray()
      .forEach(((pEdge: Edge) => edgesRef.current.remove(pEdge.id as string)));
  }, [state.devices, dispatch, hostID]);

  // Keyboard-Events
  useEffect(() =>
  {
    const listener = (event: KeyboardEvent) =>
    {
      if (event.keyCode === 46)
        _handleDelete(nodesRef.current, edgesRef.current, state.selection?.devices || [], state.selection?.edges || [], dispatch)
      else if (event.key === "a")
        _handleCreate(nodesRef.current, edgesRef.current, state.selection?.devices || [], state.selection?.edges || [], dispatch)
      else if (event.key === "r")
        dispatch(ACTION_RELOAD)
    };
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener);
  }, [state.selection, dispatch])

  // Sync Selection with State
  useEffect(() =>
  {
    networkRef.current?.setSelection({
      nodes: state.selection?.devices || [],
      edges: state.selection?.edges || []
    }, {
      unselectAll: true
    })
  }, [state.selection])

  // Create the double click function, but without retriggering a refresh, if it changes
  const onDoubleClickRef = useCallbackNoRefresh(() => (pNodeIDs: string[]) =>
  {
    if (!state.devices)
      return;
    const selected = _.head(state.devices.filter(pDevice => pNodeIDs.indexOf(pDevice.id) > -1))
    if (selected)
      router.push(router.asPath + "/devices/" + selected.id);
  }, [state.devices, router])

  // Create the network graph once
  const graph = useMemo(() => (
    <NetworkGraph nodes={nodesRef.current} edges={edgesRef.current} onMove={pPos => _nodesMoved(pPos, dispatch)}
                  onDoubleClick={pNodeIDs => onDoubleClickRef.current(pNodeIDs)}
                  onSelectionChanged={(nodes, edges) => dispatch({
                    type: EStackStateActions.SET_SELECTION,
                    payload: {
                      devices: nodes,
                      edges,
                    }
                  })}
                  onDragStart={() => {}} onDragEnd={() => {}}
                  onNetworkChange={network => networkRef.current = network}/>
  ), [dispatch, onDoubleClickRef]);

  return (
    <div className={classNames(className, styles.graphContainer)}>
      {graph}
    </div>
  );
};

export default NetworkComponent;

/**
 * This method gets called, if the positions of nodes
 * have been moved and should be updated on remote
 *
 * @param pPositions Object with {nodeID: {x: 99, y: 99}}
 * @param pDispatchFn Function to dispatch actions
 * @private
 */
function _nodesMoved(pPositions: { [nodeID: string]: Position }, pDispatchFn: StackDispatch)
{
  Object.keys(pPositions).forEach(pNodeID => pDispatchFn(ACTION_UPDATE_DEVICE(pNodeID, {
    id: pNodeID,
    location: pPositions[pNodeID],
  })));
}

/**
 * Handles a create request
 *
 * @param pCurrentNodes Reference to the currently used nodes
 * @param pCurrentEdges Reference to the currently used edges
 * @param pSelectedNodeIDs string-array of the selected nodes ids
 * @param pSelectedEdgeIDs string-array of the selected edge ids
 * @param pDispatchFn Function to dispatch actions
 */
function _handleCreate(pCurrentNodes: DataSetNodes, pCurrentEdges: DataSetEdges,
                       pSelectedNodeIDs: string[], pSelectedEdgeIDs: string[],
                       pDispatchFn: StackDispatch)
{
  if (pSelectedNodeIDs.length === 2)
    pDispatchFn(ACTION_ADD_EDGE_BETWEEN(pSelectedNodeIDs[0], pSelectedNodeIDs[1]))
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
                       pDispatchFn: StackDispatch)
{
  // Remove Edges
  pSelectedEdgeIDs.forEach(pEdgeID =>
  {
    const edge = pCurrentEdges.get(pEdgeID);
    if (edge)
      pDispatchFn(ACTION_REMOVE_EDGE_BETWEEN(edge.from as string, edge.to as string))
  })
}
