import { mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { CardLayout, CardLayoutFooter, CardLayoutHeader } from "components/base/layouts/CardLayout";
import { FormLayout } from "components/base/layouts/FormLayout";
import { ISatellite } from "models/definitions/backend/satellite";
import { useActiveStack, useBackend } from "models/states/DataState";
import { ErrorPage } from "pages/ErrorPage";
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Button, Input, Loader } from "semantic-ui-react";
import { ApproveDestructiveModal } from "../../modals/CommonModals";
import styles from "./SatellitePage.module.scss";

export const SatellitePage: React.VFC = () =>
{
  const { id: stackID, satelliteID } = useParams<{ id: string, satelliteID: string }>();
  const { getSatellite, deleteSatellite, updateSatellite, generateLease, revokeLease } = useBackend();
  const { reload } = useActiveStack();
  const [reloadCounter, setReloadCounter] = useState<number>(0);
  const [satellite, setSatellite] = useState<ISatellite | null>();
  const { push } = useHistory();

  useEffect(() =>
  {
    // Load Satellite
    getSatellite(stackID, satelliteID)
      .then(pSat => setSatellite(pSat))
      .catch(() => setSatellite(null));
  }, [getSatellite, satelliteID, reloadCounter, stackID]);

  // undefined = loading
  if (satellite === undefined)
    return <Loader active/>;

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
                                  .then(reload)
                                  .then(() => push("/stacks/" + stackID))}
                                onSave={(satellite) => updateSatellite(stackID, satellite)
                                  .then(reload)
                                  .then(() => push("/stacks/" + stackID))}/>;
};

type SatellitePageWithDataProps = {
  satellite: ISatellite,
  onGenerateLease: () => void,
  onRevokeLease: (leaseID: string) => void,
  onDelete: () => void,
  onSave: (changedSatellite: ISatellite) => void,
};

const SatellitePageWithData: React.VFC<SatellitePageWithDataProps> = ({ satellite, onGenerateLease, onRevokeLease, onDelete, onSave }) =>
{
  const changedSatellite: ISatellite = {
    ...satellite,
  };

  const footer = (
    <CardLayoutFooter>
      <Button positive onClick={() => onSave(changedSatellite)}>Save</Button>
      <Button onClick={onGenerateLease}>Generate Lease</Button>
      <div className={styles.spacer}/>
      <ApproveDestructiveModal title={"Delete Satellite?"} trigger={<Button negative onClick={onDelete}>Delete Satellite</Button>}>
        Do you really want to permanently delete this satellite?<br/>
        This action can not be undone and results in loosing all satellite related data!<br/>
        After this you are unable to login with the satellite and you probably have to reconfigure your infrastructure.
        <pre>
          id: {satellite.id}<br/>
          name: {satellite.displayName}
        </pre>
      </ApproveDestructiveModal>
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
              <Button basic onClick={() => onRevokeLease(pLease.id)}>
                <Icon path={mdiTrashCanOutline} size={0.8}/>
              </Button>
            </div>
          </React.Fragment>
        ))}
    </FormLayout>
    <FormLayout className={styles.general}>
      <span>Name</span>
      <Input defaultValue={satellite.displayName} onChange={e => changedSatellite.displayName = e.target.value}/>
    </FormLayout>
  </CardLayout>;
};
