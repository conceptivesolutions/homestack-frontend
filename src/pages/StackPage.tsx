import { mdiMonitor, mdiPlus, mdiSatelliteUplink, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { TitledList, TitledListEntry } from "components/base/list/TitledList";
import { Loading } from "components/base/Loading";
import { DeviceDetails } from "components/details/DeviceDetails";
import NetworkComponent from "components/graph/NetworkComponent";
import { Slot } from "components/graph/NetworkComponentModel";
import { getMetricRecordByType, getStateColor } from "helpers/deviceHelper";
import { iconToSVG } from "helpers/iconHelper";
import _ from "lodash";
import { EMetricTypes, IDevice } from "models/definitions/backend/device";
import { useActiveStackCRUD, useActiveStackDevices, useActiveStackSatellites, useSetActiveStackID } from "models/states/DataState";
import React, { Suspense, useLayoutEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router";
import SplitPane from "react-split-pane";
import styles from "./StackPage.module.scss";

export const StackPage: React.VFC = () =>
{
  const {id} = useParams<{ id: string }>();
  const {setStackID} = useSetActiveStackID();
  const [selected, setSelected] = useState<string | null>(null);

  // set stack id before rendering (and on id updating) to avoid flickering
  useLayoutEffect(() => setStackID(id), [id, setStackID]);

  return <>
    <SplitPane className={styles.page} split="vertical" defaultSize={216} minSize={216} primary="first">
      <div className={styles.navigator}>
        <Suspense fallback={<Loading size={1}/>}>
          <div className={styles.navigatorTrees}>
            <SatellitesTree selection={selected} onSelect={setSelected}/>
            <DevicesTree selection={selected} onSelect={setSelected}/>
          </div>
        </Suspense>
      </div>
      <Suspense fallback={<Loading size={1}/>}>
        <NetworkGraph selection={selected} onSelect={setSelected}/>
        {selected && <Details selection={selected}/>}
      </Suspense>
    </SplitPane>
  </>;
};

/**
 * Tree for Satellites on the left side
 */
const SatellitesTree: React.VFC<{ onSelect: (id: string) => void, selection: string | null }> = ({selection}) =>
{
  const {satellites} = useActiveStackSatellites();
  const {url} = useRouteMatch();
  const {createSatellite, deleteSatellite} = useActiveStackCRUD();
  const {push} = useHistory();

  return <div className={styles.listContainer}>
    <TitledList className={styles.list} title="Satellites">
      {satellites?.map(pSat => <TitledListEntry key={pSat.id} icon={mdiSatelliteUplink}
                                                active={selection === pSat.id}
                                                hoverIcon={mdiTrashCanOutline}
                                                hoverIconColor={"#ca1a1a"}
                                                onHoverIconClick={() => deleteSatellite(pSat.id)}
                                                url={url + "/satellites/" + pSat.id}>
        {pSat.id}
      </TitledListEntry>)}
    </TitledList>
    <button className={styles.listAdd} onClick={() => createSatellite().then(pNewID => push(url + "/satellites/" + pNewID))}>
      <Icon size={1} path={mdiPlus}/>
    </button>
  </div>;
};

/**
 * Tree for Devices on the left side
 */
const DevicesTree: React.VFC<{ onSelect: (id: string) => void, selection: string | null }> = ({onSelect, selection}) =>
{
  const {devices} = useActiveStackDevices();
  const {url} = useRouteMatch();
  const {createDevice, deleteDevice} = useActiveStackCRUD();
  const {push} = useHistory();

  return <div className={styles.listContainer}>
    <TitledList className={styles.list} title="Devices">
      {devices?.map(pDev => <TitledListEntry key={pDev.id} icon={(pDev.icon && iconToSVG(pDev.icon)) || mdiMonitor}
                                             onClick={() => onSelect(pDev.id)}
                                             active={selection === pDev.id}
                                             url={url + "/devices/" + pDev.id}
                                             hoverIcon={mdiTrashCanOutline}
                                             hoverIconColor={"#ca1a1a"}
                                             onHoverIconClick={() => deleteDevice(pDev.id)}>
        {pDev.address || pDev.id}
      </TitledListEntry>)}
    </TitledList>
    <button className={styles.listAdd} onClick={() => createDevice().then(pNewID => push(url + "/devices/" + pNewID))}>
      <Icon size={1} path={mdiPlus}/>
    </button>
  </div>;
};

/**
 * Details of the currently selected object
 */
const Details: React.VFC<{ selection: string }> = ({selection}) =>
{
  const {devices} = useActiveStackDevices();
  const device = _.find(devices, pDev => pDev.id === selection);

  // we do not support other selection than devices
  if (!device)
    return <></>;

  return <div className={styles.detailsContainer}>
    <div className={styles.details}>
      <DeviceDetails device={device}/>
    </div>
  </div>;
};

/**
 * Main Graph component
 */
const NetworkGraph: React.VFC<{ onSelect: (id: string | null) => void, selection: string | null }> = ({onSelect, selection}) =>
{
  const {devices} = useActiveStackDevices();
  const {updateDevice, deleteDevice, updateSlotTarget, deleteSlotConnection} = useActiveStackCRUD();

  return <NetworkComponent className={styles.network}
                           data={{nodes: devices || []}}
                           onSelectionChanged={(obj) =>
                           {
                             if (!obj || !obj.id)
                               onSelect(null);
                             else
                               onSelect(obj.id);
                           }}
                           selection={{node: _.find(devices, pDev => pDev.id === selection)}}
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
                           })}
                           onMove={(pSource, pX, pY) =>
                           {
                             if (pSource.kind === "node")
                             {
                               const device = _.find(devices, pDev => pDev.id === pSource.id);
                               if (device)
                               {
                                 updateDevice({
                                   ...device,
                                   location: {
                                     x: pX,
                                     y: pY,
                                   },
                                 });
                                 return true;
                               }
                             }
                             return false;
                           }}
                           onDelete={pObject =>
                           {
                             if (pObject.kind === "node")
                               deleteDevice(pObject.id);
                             else if (pObject.kind === "connection")
                               deleteSlotConnection(pObject.fromSlot);
                           }}
                           onDrop={(pSource: any, pTarget: any) =>
                           {
                             if (pSource.kind === "slot" && pTarget.kind === "slot")
                               updateSlotTarget(pSource.id, pTarget.id);
                           }}/>;
};
