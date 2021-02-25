import { mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { CardLayout, CardLayoutFooter, CardLayoutHeader } from "components/base/layouts/CardLayout";
import { FormLayout } from "components/base/layouts/FormLayout";
import { Loading } from "components/base/Loading";
import { ISatellite } from "models/definitions/backend/satellite";
import { useBackend } from "models/states/DataState";
import { ErrorPage } from "pages/ErrorPage";
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import styles from "./SatellitePage.module.scss";

export const SatellitePage: React.VFC = () =>
{
  const {id: stackID, satelliteID} = useParams<{ id: string, satelliteID: string }>();
  const {getSatellite, deleteSatellite, generateLease, revokeLease} = useBackend();
  const [reloadCounter, setReloadCounter] = useState<number>(0);
  const [satellite, setSatellite] = useState<ISatellite | null>();
  const {push} = useHistory();

  useEffect(() =>
  {
    // Load Satellite
    getSatellite(stackID, satelliteID)
      .then(pSat => setSatellite(pSat))
      .catch(() => setSatellite(null));
  }, [getSatellite, satelliteID, reloadCounter, stackID]);

  // undefined = loading
  if (satellite === undefined)
    return <Loading size={10}/>;

  // null = not found
  if (satellite === null)
    return <ErrorPage/>;

  // found
  return <SatellitePageWithData satellite={satellite}
                                onGenerateLease={() => generateLease(stackID, satellite.id)
                                  .then(pLease => alert("Generated Lease:\nid:" + pLease?.id + "\ntoken:" + pLease?.token))
                                  .then(() => setReloadCounter(pV => pV + 1))}
                                onRevokeLease={(leaseID) => revokeLease(stackID, satellite.id, leaseID)
                                  .then(() => setReloadCounter(pV => pV + 1))}
                                onDelete={() => deleteSatellite(stackID, satellite.id)
                                  .then(() => push("/stacks/" + stackID))}
                                onSave={() => push("/stacks/" + stackID)}/>;
};

type SatellitePageWithDataProps = {
  satellite: ISatellite,
  onGenerateLease: () => void,
  onRevokeLease: (leaseID: string) => void,
  onDelete: () => void,
  onSave: () => void,
};

const SatellitePageWithData: React.VFC<SatellitePageWithDataProps> = ({satellite, onGenerateLease, onRevokeLease, onDelete, onSave}) =>
{
  const footer = (
    <CardLayoutFooter>
      <button className={styles.primary} onClick={onSave}>Save</button>
      <button onClick={onGenerateLease}>Generate Lease</button>
      <div className={styles.spacer}/>
      <button className={styles.destructive} onClick={onDelete}>Delete Satellite</button>
    </CardLayoutFooter>
  );

  const header = (
    <CardLayoutHeader>
      <h1>{satellite.id}</h1>
    </CardLayoutHeader>
  );

  return <CardLayout header={header} footer={footer} className={styles.container}>
    <FormLayout>
      {satellite.leases?.filter(pLease => !pLease.revokedDate)
        .map(pLease => (
          <React.Fragment key={pLease.id}>
            <span>Lease</span>
            <div className={styles.leaseContainer}>
              <div className={styles.leaseID}>{pLease.id}</div>
              <button onClick={() => onRevokeLease(pLease.id)}>
                <Icon path={mdiTrashCanOutline} size={0.8}/>
              </button>
            </div>
          </React.Fragment>
        ))}
    </FormLayout>
  </CardLayout>;
};