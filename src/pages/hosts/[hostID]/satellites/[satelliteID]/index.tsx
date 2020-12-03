import React, {useContext} from "react";
import {mdiArrowLeft, mdiTrashCanOutline} from "@mdi/js";
import SatelliteLayout from "../../../../../layouts/SatelliteLayout";
import {INavBarItem} from "../../../../../components/navbar/NavBarItem";
import {useRouter} from "next/router";
import CardLayout, {CardLayoutFooter, CardLayoutHeader} from "../../../../../layouts/CardLayout";
import styles from "./index.module.scss";
import CardTableLayout from "../../../../../components/layouts/CardTableLayout";
import {ACTION_GENERATE_LEASE, ACTION_REVOKE_LEASE, SatelliteContext} from "../../../../../context/SatelliteContext";
import Icon from "@mdi/react";

const SatellitePage = () =>
{
  const {push, query: {hostID, satelliteID}} = useRouter();
  const {state, dispatch} = useContext(SatelliteContext);
  const fnBack = () => push("/hosts/" + hostID);

  // Back to Host - Action
  SatellitePage.Items[0].onClick = fnBack;

  const header = (
    <CardLayoutHeader>
      <h1>{satelliteID}</h1>
    </CardLayoutHeader>
  );

  const footer = (
    <CardLayoutFooter>
      <button className={styles.primary}>Save</button>
      <button onClick={() => dispatch(ACTION_GENERATE_LEASE(pLease =>
        alert("Generated Lease:\nid:" + pLease.id + "\ntoken:" + pLease.token)))}>Generate Lease
      </button>
      <div className={styles.spacer}/>
      <button className={styles.destructive}>Delete Satellite</button>
    </CardLayoutFooter>
  )

  return <CardLayout header={header} footer={footer}>
    <CardTableLayout>
      {state.leases?.filter(pLease => !pLease.revokedDate)
        .map(pLease => (
          <React.Fragment key={pLease.id}>
            <span>Lease</span>
            <div className={styles.leaseContainer}>
              <div className={styles.leaseID}>{pLease.id}</div>
              <button onClick={() => dispatch(ACTION_REVOKE_LEASE(pLease.id))}>
                <Icon path={mdiTrashCanOutline} size={0.8}/>
              </button>
            </div>
          </React.Fragment>
        ))}
    </CardTableLayout>
  </CardLayout>
}

SatellitePage.Layout = SatelliteLayout;
SatellitePage.Items = [{
  alignment: "left",
  children: "Back to Host",
  icon: mdiArrowLeft,
}] as INavBarItem[];
export default SatellitePage;
