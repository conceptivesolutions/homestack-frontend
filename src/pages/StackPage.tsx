import { mdiMonitor, mdiPlus, mdiSatelliteUplink, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { TitledList, TitledListEntry } from "components/base/list/TitledList";
import { DeviceDetails } from "components/details/DeviceDetails";
import NetworkComponent from "components/graph/NetworkComponent";
import { Slot } from "components/graph/NetworkComponentModel";
import { getStateColor } from "helpers/deviceHelper";
import { iconToSVG } from "helpers/iconHelper";
import _ from "lodash";
import { EMetricTypes, IDevice } from "models/definitions/backend/device";
import { useActiveStack, useActiveStackCRUD, useActiveStackDevices, useActiveStackRecords, useActiveStackSatellites, useSetActiveStackID } from "models/states/DataState";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router";
import SplitPane from "react-split-pane";
import { Button } from "semantic-ui-react";
import { ApproveDestructiveModal } from "../modals/CommonModals";
import styles from "./StackPage.module.scss";

export const StackPage: React.VFC = () =>
{
  const { id } = useParams<{ id: string }>();
  const { setStackID } = useSetActiveStackID();
  const [selected, setSelected] = useState<string | null>(null);
  const { reload } = useActiveStack();

  // set stack id before rendering (and on id updating) to avoid flickering
  useLayoutEffect(() => setStackID(id), [id, setStackID]);

  // reload automatically
  useEffect(() =>
  {
    const ref = setInterval(() => reload(), 5000);
    return () => clearInterval(ref);
  });

  return <>
    <SplitPane className={styles.page} split="vertical" defaultSize={216} minSize={216} primary="first">
      <div className={styles.navigator}>
        <div className={styles.navigatorTrees}>
          <SatellitesTree selection={selected} onSelect={setSelected}/>
          <DevicesTree selection={selected} onSelect={setSelected}/>
        </div>
      </div>
      <>
        <NetworkGraph selection={selected} onSelect={setSelected}/>
        {selected && <Details selection={selected}/>}
      </>
    </SplitPane>
  </>;
};

/**
 * Tree for Satellites on the left side
 */
const SatellitesTree: React.VFC<{ onSelect: (id: string) => void, selection: string | null }> = ({ selection }) =>
{
  const { satellites } = useActiveStackSatellites();
  const { url } = useRouteMatch();
  const { createSatellite, deleteSatellite } = useActiveStackCRUD();
  const { push } = useHistory();

  return <div className={styles.listContainer}>
    <TitledList className={styles.list} title="Satellites">
      {satellites?.map(pSat =>
        <TitledListEntry key={pSat.id} icon={mdiSatelliteUplink}
                         active={selection === pSat.id}
                         hoverIcon={mdiTrashCanOutline}
                         hoverIconColor={"#ca1a1a"}
                         url={url + "/satellites/" + pSat.id}
                         customizeHoverIcon={pIcon => <ApproveDestructiveModal title={"Delete Satellite?"}
                                                                               onProceed={() => deleteSatellite(pSat.id)}
                                                                               trigger={pIcon}>
                           Do you really want to permanently delete this satellite?<br/>
                           This action can not be undone and results in loosing all satellite related data!<br/>
                           After this you are unable to login with the satellite and you probably have to reconfigure your infrastructure.
                           <pre>
                             id: {pSat.id}<br/>
                           </pre>
                         </ApproveDestructiveModal>}>
          {pSat.id}
        </TitledListEntry>,
      )}
    </TitledList>
    <Button basic className={styles.listAdd} onClick={() => createSatellite().then(pNewID => push(url + "/satellites/" + pNewID))}>
      <Icon size={1} path={mdiPlus}/>
    </Button>
  </div>;
};

/**
 * Tree for Devices on the left side
 */
const DevicesTree: React.VFC<{ onSelect: (id: string) => void, selection: string | null }> = ({ onSelect, selection }) =>
{
  const { devices } = useActiveStackDevices();
  const { url } = useRouteMatch();
  const { createDevice, deleteDevice } = useActiveStackCRUD();
  const { push } = useHistory();
  const { latestRecordOfDevice, latestRecordsOfDevice } = useActiveStackRecords();

  return <div className={styles.listContainer}>
    <TitledList className={styles.list} title="Devices">
      {devices?.map(pDev =>
        <TitledListEntry key={pDev.id} icon={(pDev.icon && iconToSVG(pDev.icon)) || mdiMonitor}
                         color={getStateColor(latestRecordsOfDevice(pDev.id))}
                         onClick={() => onSelect(pDev.id)}
                         active={selection === pDev.id}
                         url={url + "/devices/" + pDev.id}
                         hoverIcon={mdiTrashCanOutline}
                         hoverIconColor={"#ca1a1a"}
                         customizeHoverIcon={pIcon => <ApproveDestructiveModal title={"Delete Device?"}
                                                                               onProceed={() => deleteDevice(pDev.id)}
                                                                               trigger={pIcon}>
                           Do you really want to permanently delete this device?<br/>
                           This action can not be undone and results in loosing all device related data!<br/>
                           <pre>
                             id: {pDev.id}<br/>
                             dns: {latestRecordOfDevice(pDev.id, EMetricTypes.REVERSE_DNS)?.result?.name}<br/>
                             address: {pDev.address}<br/>
                           </pre>
                         </ApproveDestructiveModal>}>
          {latestRecordOfDevice(pDev.id, EMetricTypes.REVERSE_DNS)?.result?.name || pDev.address || pDev.id}
        </TitledListEntry>)}
    </TitledList>
    <Button basic className={styles.listAdd} onClick={() => createDevice().then(pNewID => push(url + "/devices/" + pNewID))}>
      <Icon size={1} path={mdiPlus}/>
    </Button>
  </div>;
};

/**
 * Details of the currently selected object
 */
const Details: React.VFC<{ selection: string }> = ({ selection }) =>
{
  const { devices } = useActiveStackDevices();
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
const NetworkGraph: React.VFC<{ onSelect: (id: string | null) => void, selection: string | null }> = ({ onSelect, selection }) =>
{
  const { devices } = useActiveStackDevices();
  const { updateDevice, deleteDevice } = useActiveStackCRUD();
  const { latestRecordOfDevice, latestRecordsOfDevice } = useActiveStackRecords();

  return <NetworkComponent className={styles.network}
                           data={{ nodes: devices || [] }}
                           onSelectionChanged={(obj) =>
                           {
                             if (!obj || !obj.id)
                               onSelect(null);
                             else
                               onSelect(obj.id);
                           }}
                           selection={{ node: _.find(devices, pDev => pDev.id === selection) }}
                           nodeToNodeConverter={(pDev: IDevice) => ({
                             kind: "node",
                             id: pDev.id,
                             title: latestRecordOfDevice(pDev.id, EMetricTypes.REVERSE_DNS)?.result?.name || pDev.address || pDev.id,
                             x: pDev.location?.x || 0,
                             y: pDev.location?.y || 0,
                             icon: pDev.icon,
                             color: getStateColor(latestRecordsOfDevice(pDev.id)),
                             slots: pDev.slots?.map(pRow => pRow.map(pSlot => ({
                               kind: "slot",
                               id: pSlot.id,
                               targetSlotID: pSlot.targetSlotID,
                               state: pSlot.state,
                             }) as Slot)) || [],
                           })}
                           onNodeMoved={(pSource, pX, pY) =>
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

                             return false;
                           }}
                           onNodeDeleted={pNode => deleteDevice(pNode.id)}/>;
};
