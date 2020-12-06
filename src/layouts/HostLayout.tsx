import {mdiRefresh} from "@mdi/js";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext} from 'react';
import PageContainer from "widgets/page/PageContainer";
import {GlobalContext} from "../context/GlobalContext";
import {ACTION_RELOAD, HostContext, HostProvider} from "../context/HostContext";

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
                            onClick: () => dispatch(ACTION_RELOAD)
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
