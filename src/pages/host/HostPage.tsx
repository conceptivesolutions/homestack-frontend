import React, {useContext} from "react";
import styles from "./HostPage.module.scss";
import NetworkComponent from "./network/NetworkComponent";
import {useParams} from "react-router";
import NavigatorComponent from "./navigator/NavigatorComponent";
import PageContainer from "../../components/page/PageContainer";
import {HostProvider} from "./state/HostContext";
import {GlobalContext} from "../../state/GlobalContext";
import _ from "lodash";

/**
 * Creates an "Host"-Page and loads the host with the ID from the url
 */
const HostPage = () =>
{
  const {state: {hosts}} = useContext(GlobalContext)
  const {hostID} = useParams();
  if (!hostID || _.isEmpty(hosts))
    return <></>;

  const currentHost = _.find(hosts, pHost => pHost.id === hostID);
  if (!currentHost)
    return <></>;

  return <HostProvider id={hostID}>
    <PageContainer navigator={(<NavigatorComponent className={styles.navigator}/>)}
                   navbarItems={[{
                     alignment: "left",
                     children: currentHost.displayName || currentHost.id,
                     active: true,
                   }, {
                     alignment: "left",
                     children: "+",
                     disabled: true,
                   }]}>
      <NetworkComponent hostID={hostID}/>
    </PageContainer>
  </HostProvider>
};

export default HostPage;
