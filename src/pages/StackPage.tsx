import { mdiMonitor } from "@mdi/js";
import { TitledList, TitledListEntry } from "components/base/list/TitledList";
import { Loading } from "components/base/Loading";
import NetworkComponent from "components/graph/NetworkComponent";
import { Slot } from "components/graph/NetworkComponentModel";
import { getMetricRecordByType, getStateColor } from "helpers/deviceHelper";
import { iconToSVG } from "helpers/iconHelper";
import { EMetricTypes, IDevice } from "models/definitions/backend/device";
import { useActiveStackDevices, useSetActiveStackID } from "models/states/DataState";
import React, { Suspense, useLayoutEffect } from 'react';
import { useParams, useRouteMatch } from "react-router";
import SplitPane from "react-split-pane";
import styles from "./StackPage.module.scss";

export const StackPage: React.VFC = () =>
{
  const {id} = useParams<{ id: string }>();
  const {setStackID} = useSetActiveStackID();

  // set stack id before rendering (and on id updating) to avoid flickering
  useLayoutEffect(() => setStackID(id), [id, setStackID]);

  return <SplitPane className={styles.page} split="vertical" defaultSize={216} minSize={216} primary="first">
    <Suspense fallback={<Loading size={1}/>}>
      <DevicesTree/>
    </Suspense>
    <Suspense fallback={<Loading size={1}/>}>
      <NetworkGraph/>
    </Suspense>
  </SplitPane>;
};

/**
 * Tree for Devices on the left side
 */
const DevicesTree: React.VFC = () =>
{
  //todo satellites
  const {devices} = useActiveStackDevices();
  const {url} = useRouteMatch();

  return <TitledList title="Devices">
    {devices?.map(pDev => <TitledListEntry key={pDev.id} icon={(pDev.icon && iconToSVG(pDev.icon)) || mdiMonitor}
                                           url={url + "/devices/" + pDev.id}>
      {pDev.address || pDev.id}
    </TitledListEntry>)}
  </TitledList>;
};

/**
 * Main Graph component
 */
const NetworkGraph: React.VFC = () =>
{
  //todo selection
  const {devices} = useActiveStackDevices();
  return <NetworkComponent className={styles.network}
                           data={{nodes: devices || []}}
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
                             }) as Slot)) || [],
                           })}/>;
};
