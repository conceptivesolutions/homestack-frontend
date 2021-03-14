import { CardLayout, CardLayoutFooter, CardLayoutHeader } from "components/base/layouts/CardLayout";
import _ from "lodash";
import { ISatellite } from "models/definitions/backend/satellite";
import { useActiveStack, useBackend } from "models/states/DataState";
import { ErrorPage } from "pages/ErrorPage";
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from "react-router";
import { Button, Form, Icon, Loader, Table } from "semantic-ui-react";
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

const SatellitePageWithData: React.VFC<SatellitePageWithDataProps> = ({ satellite: initialData, onGenerateLease, onRevokeLease, onDelete, onSave }) =>
{
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [satellite, setSatellite] = useState<ISatellite>({ ...initialData });

  const footer = (
    <CardLayoutFooter>
      <Button positive>Save</Button>
      <div className={styles.spacer}/>
      <ApproveDestructiveModal title={"Delete Satellite?"} onProceed={onDelete} trigger={<Button negative type="button">Delete Satellite</Button>}>
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
      <h1>{satellite.displayName || satellite.id}</h1>
      {satellite.displayName && <span>{satellite.id}</span>}
    </CardLayoutHeader>
  );

  // validate if object changes
  useEffect(() => setErrors(_validate(satellite)), [satellite]);

  return <Form onSubmit={() => _validate(satellite) && onSave(satellite)} className={styles.container}>
    <CardLayout header={header} footer={footer}>
      <div className={styles.innerContainer}>
        <Form.Input label={"Name"} width={16} error={errors.get("name")}
                    defaultValue={satellite.displayName} onChange={e => setSatellite({ ...satellite, displayName: e.target.value })}/>
      </div>
      <Form.Field className={styles.innerContainer}>
        <label>Leases</label>
        <Table singleLine>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell collapsing/>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {satellite.leases?.filter(pLease => !pLease.revokedDate)
              .map(pLease => (
                <Table.Row key={pLease.id}>
                  <Table.Cell>{pLease.id}</Table.Cell>
                  <Table.Cell collapsing>
                    <Button labelPosition='left' icon onClick={() => onRevokeLease(pLease.id)}>
                      <Icon name={"trash alternate outline"}/>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan={2}>
                <Button labelPosition='left' icon onClick={onGenerateLease}>
                  <Icon name={'add'}/>
                  Generate Lease
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Form.Field>
    </CardLayout>
  </Form>;
};

function _validate(verifyObj: ISatellite): Map<string, string>
{
  const currentErrors = new Map<string, string>();

  if (_.isEmpty(verifyObj.displayName))
    currentErrors.set("name", "Name must not be empty");

  return currentErrors;
}
