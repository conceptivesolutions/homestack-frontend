import React, {useContext} from 'react';
import {GlobalContext} from "../context/GlobalContext";
import {useRouter} from "next/router";
import _ from "lodash";
import {ACTION_RELOAD_DEVICES, HostContext, HostProvider} from "../context/HostContext";
import {mdiRefresh} from "@mdi/js";
import PageContainer from "../components/page/PageContainer";

interface IHostLayout
{
  children?: React.ReactNode,
}

const HostLayout = (props: IHostLayout) =>
{
  const {state: {hosts}} = useContext(GlobalContext)
  const {query: {hostID}} = useRouter();

  if (!hostID || _.isEmpty(hosts))
    return <></>;

  const currentHost = _.find(hosts, pHost => pHost.id === hostID);
  if (!currentHost)
    return <></>;

  const InnerContainer = ({children}: { children: React.ReactNode }) =>
  {
    const {dispatch} = useContext(HostContext)

    // @ts-ignore
    const subNavbarItems = children?.type?.Items || [];

    // @ts-ignore
    return <PageContainer navigator={children?.type?.Navigator}
                          navbarItems={[...subNavbarItems, {
                            alignment: "right",
                            icon: mdiRefresh,
                            onClick: () => dispatch(ACTION_RELOAD_DEVICES)
                          }]}>
      {children}
    </PageContainer>;
  }

  return <HostProvider id={currentHost.id}>
    <InnerContainer>
      {props.children}
    </InnerContainer>
  </HostProvider>
};

export default HostLayout;
