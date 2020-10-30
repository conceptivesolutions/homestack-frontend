import React, {useContext} from "react";
import styles from "./[hostID].module.scss";
import HostNavigatorComponent from "../../widgets/navigator/HostNavigatorComponent";
import PageContainer from "../../components/page/PageContainer";
import {HostProvider} from "../../context/HostContext";
import {GlobalContext} from "../../state/GlobalContext";
import _ from "lodash";
import {useRouter} from "next/router";
import NetworkComponent from "../../widgets/network/NetworkComponent";

/**
 * Creates an "Host"-Page and loads the host with the ID from the url
 */
const HostID = () =>
{
  const {state: {hosts}} = useContext(GlobalContext)
  const {query: {hostID}} = useRouter();

  if (!hostID || _.isEmpty(hosts))
    return <></>;

  const currentHost = _.find(hosts, pHost => pHost.id === hostID);
  if (!currentHost)
    return <></>;

  return <HostProvider id={currentHost.id}>
    <PageContainer navigator={(<HostNavigatorComponent className={styles.navigator}/>)}
                   navbarItems={[{
                     alignment: "left",
                     children: currentHost.displayName || currentHost.id,
                     active: true,
                   }, {
                     alignment: "left",
                     children: "+",
                     disabled: true,
                   }]}>
      <NetworkComponent hostID={currentHost.id}/>
    </PageContainer>
  </HostProvider>
};

export default HostID;
