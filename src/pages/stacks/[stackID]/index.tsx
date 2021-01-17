import NetworkComponent from "components/graph/NetworkComponent";
import {Slot} from "components/graph/NetworkComponentModel";
import {ACTION_CREATE_CONNECTION, EStackStateActions, StackContext} from "context/StackContext";
import {getMetricRecordByType} from "helpers/deviceHelper";
import {getStateColor} from "helpers/NodeHelper";
import StackLayout from "layouts/StackLayout";
import _ from "lodash";
import React, {useContext} from "react";
import {EMetricTypes, IDevice} from "types/model";
import StackNavigatorComponent from "widgets/navigator/StackNavigatorComponent";
import styles from "./index.module.scss";

const StackPage = () =>
{
  const {state: {devices, selection}, dispatch} = useContext(StackContext)
  return <NetworkComponent className={styles.networkComponent} data={{nodes: devices}}
                           nodeToNodeConverter={(pDev: IDevice) => ({
                             kind: "node",
                             id: pDev.id,
                             title: getMetricRecordByType(pDev, EMetricTypes.REVERSE_DNS)?.result?.name || pDev.address || pDev.id,
                             x: pDev.location?.x || 0,
                             y: pDev.location?.y || 0,
                             icon: pDev.icon,
                             color: getStateColor(pDev.metricRecords),
                             slots: pDev.slots?.map(pRow => pRow.map(pSlot => ({
                               kind: "slot",
                               id: pSlot.id,
                               targetSlotID: pSlot.targetSlotID,
                               state: pSlot.state,
                             }) as Slot)) || []
                           })}
                           selection={{
                             node: _.head(selection?.devices?.map(pID => _.find(devices, pDev => pDev.id === pID))),
                           }}
                           onDrop={(pSource: any, pTarget: any) =>
                           {
                             if (pSource.kind === "slot" && pTarget.kind === "slot")
                               dispatch(ACTION_CREATE_CONNECTION(pSource, pTarget))
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
