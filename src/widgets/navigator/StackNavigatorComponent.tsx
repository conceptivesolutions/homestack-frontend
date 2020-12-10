import {mdiMonitor, mdiSatellite} from "@mdi/js";
import classNames from "classnames";
import TitledList from "components/lists/titledlist/TitledList";
import TitledListEntry from "components/lists/titledlist/TitledListEntry";
import {StackContext} from "context/StackContext";
import {iconToSVG} from "helpers/iconHelper";
import {getStateColor} from "helpers/NodeHelper";
import {useRouter} from "next/router";
import React, {useContext} from "react";
import styles from "./StackNavigatorComponent.module.scss";

/**
 * Simple Navigator for a single stack
 */
const StackNavigatorComponent = () =>
{
  const {state} = useContext(StackContext)
  const router = useRouter();

  return (
    <div className={classNames(styles.container)}>
      <TitledList title={"Satellites"}>
        {state.satellites?.map(pSat => <TitledListEntry icon={mdiSatellite} url={router.asPath + "/satellites/" + pSat.id}>{pSat.id}</TitledListEntry>)}
      </TitledList>
      <TitledList title={"Devices"}>
        {state.devices?.map(pDev => <TitledListEntry icon={pDev.icon && iconToSVG(pDev.icon) || mdiMonitor}
                                                     url={router.asPath + "/devices/" + pDev.id}
                                                     color={getStateColor(pDev.metricRecords)}>{pDev.address || pDev.id}</TitledListEntry>)}
      </TitledList>
    </div>
  );
};

export default StackNavigatorComponent;
