import NetworkComponent from "components/graph/NetworkComponent";
import {SlotState} from "components/graph/NetworkComponentModel";
import {EStackStateActions, StackContext} from "context/StackContext";
import {getMetricRecordByType} from "helpers/deviceHelper";
import {getStateColor} from "helpers/NodeHelper";
import StackLayout from "layouts/StackLayout";
import _ from "lodash";
import React, {useContext} from "react";
import {EMetricTypes, IDevice, IEdge} from "types/model";
import {v4 as uuidv4} from 'uuid';
import StackNavigatorComponent from "widgets/navigator/StackNavigatorComponent";
import styles from "./index.module.scss";

const StackPage = () =>
{
  const {state: {devices, selection}, dispatch} = useContext(StackContext)
  return <NetworkComponent className={styles.networkComponent} data={{nodes: devices, edges: devices?.flatMap(pDev => pDev.edges || [])}}
                           nodeToNodeConverter={(pDev: IDevice) => ({
                             kind: "node",
                             id: pDev.id,
                             title: getMetricRecordByType(pDev, EMetricTypes.REVERSE_DNS)?.result?.name || pDev.address || pDev.id,
                             x: pDev.location?.x || 0,
                             y: pDev.location?.y || 0,
                             icon: pDev.icon,
                             color: getStateColor(pDev.metricRecords),
                             slots: {
                               x: 4,
                               y: 1,
                               data: [{
                                 kind: "slot",
                                 id: uuidv4(),
                                 state: SlotState.UP,
                               }, {
                                 kind: "slot",
                                 id: uuidv4(),
                                 state: SlotState.EMPTY,
                               }, {
                                 kind: "slot",
                                 id: uuidv4(),
                                 state: SlotState.EMPTY,
                               }, {
                                 kind: "slot",
                                 id: uuidv4(),
                                 state: SlotState.UP,
                               }]
                             }
                           })}
                           edgeToEdgeConverter={(pEdge: IEdge) => ({
                             kind: "edge",
                             from: pEdge.sourceID,
                             from_slotID: 0,
                             to: pEdge.targetID,
                             to_slotID: 0,
                           })}
                           selection={{
                             node: _.head(selection?.devices?.map(pID => _.find(devices, pDev => pDev.id === pID))),
                           }}
                           onSelectionChanged={pObject => dispatch({
                             type: EStackStateActions.SET_SELECTION,
                             payload: {
                               devices: !!pObject ? [pObject?.id] : [],
                             }
                           })}/>
}

StackPage.Navigator = <StackNavigatorComponent/>
StackPage.Layout = StackLayout;

// noinspection JSUnusedGlobalSymbols
export default StackPage;
