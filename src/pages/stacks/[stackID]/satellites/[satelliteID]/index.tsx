import {mdiArrowLeft, mdiTrashCanOutline} from "@mdi/js";
import Icon from "@mdi/react";
import CardLayout, {CardLayoutFooter, CardLayoutHeader} from "components/layouts/CardLayout";
import CardTableLayout from "components/layouts/CardTableLayout";
import {INavBarItem} from "components/navbar/NavBarItem";
import {ACTION_GENERATE_LEASE, ACTION_REVOKE_LEASE, SatelliteContext} from "context/SatelliteContext";
import SatelliteLayout from "layouts/SatelliteLayout";
import {useRouter} from "next/router";
import React, {useContext} from "react";
import styles from "./index.module.scss";

const SatellitePage = () =>
{
  const {push, query: {stackID, satelliteID}} = useRouter();
  const {state, dispatch} = useContext(SatelliteContext);

  // Back to Stack - Action
  SatellitePage.Items[0].onClick = () => push("/stacks/" + stackID);

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

  return <CardLayout header={header} footer={footer} className={styles.container}>
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
  children: "Back to Stack",
  icon: mdiArrowLeft,
}] as INavBarItem[];

// noinspection JSUnusedGlobalSymbols
export default SatellitePage;
