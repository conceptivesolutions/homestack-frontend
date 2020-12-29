import {mdiMonitor, mdiPlusCircleOutline, mdiSatellite} from "@mdi/js";
import classNames from "classnames";
import TitledList from "components/lists/titledlist/TitledList";
import TitledListEntry from "components/lists/titledlist/TitledListEntry";
import {ACTION_CREATE_DEVICE, ACTION_CREATE_SATELLITE, EStackStateActions, StackContext} from "context/StackContext";
import {iconToSVG} from "helpers/iconHelper";
import {getStateColor} from "helpers/NodeHelper";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext} from "react";
import styles from "./StackNavigatorComponent.module.scss";

/**
 * Simple Navigator for a single stack
 */
const StackNavigatorComponent = () =>
{
  const {state, dispatch} = useContext(StackContext)
  const router = useRouter();

  const addSatellite = () => dispatch(ACTION_CREATE_SATELLITE(undefined, id => router.push(router.asPath + "/satellites/" + id)));
  const addDevice = () => dispatch(ACTION_CREATE_DEVICE(undefined, id => router.push(router.asPath + "/devices/" + id)));
  const fnSelect = (pSatelliteID?: string, pDeviceID?: string) => () => dispatch({
    type: EStackStateActions.SET_SELECTION,
    payload: {
      devices: pDeviceID ? [pDeviceID] : [],
      edges: [],
      satellites: pSatelliteID ? [pSatelliteID] : [],
    }
  });

  return (
    <div className={classNames(styles.container)}>
      <TitledList title={"Satellites"}>
        {state.satellites?.map(pSat => <TitledListEntry key={pSat.id} icon={mdiSatellite}
                                                        onClick={fnSelect(pSat.id)}
                                                        active={_.findIndex(state?.selection?.satellites, pSatID => pSatID === pSat.id) > -1}
                                                        url={router.asPath + "/satellites/" + pSat.id}>{pSat.id}</TitledListEntry>)}
        <TitledListEntry className={styles.addEntry} icon={mdiPlusCircleOutline} onClick={addSatellite}>Add Satellite</TitledListEntry>
      </TitledList>
      <TitledList title={"Devices"}>
        {state.devices?.map(pDev => <TitledListEntry key={pDev.id} icon={pDev.icon && iconToSVG(pDev.icon) || mdiMonitor}
                                                     onClick={fnSelect(undefined, pDev.id)}
                                                     active={_.findIndex(state?.selection?.devices, pDevID => pDevID === pDev.id) > -1}
                                                     url={router.asPath + "/devices/" + pDev.id}
                                                     color={getStateColor(pDev.metricRecords)}>{pDev.address || pDev.id}</TitledListEntry>)}
        <TitledListEntry className={styles.addEntry} icon={mdiPlusCircleOutline} onClick={addDevice}>Add Device</TitledListEntry>
      </TitledList>
    </div>
  );
};

export default StackNavigatorComponent;
