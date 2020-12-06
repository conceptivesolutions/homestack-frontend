import {mdiRefresh} from "@mdi/js";
import {ACTION_RELOAD, StackContext, StackProvider} from "context/StackContext";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext} from 'react';
import PageContainer from "widgets/page/PageContainer";
import {GlobalContext} from "../context/GlobalContext";

interface IHostLayout
{
  children?: React.ReactNode,
}

const HostLayout = (props: IHostLayout) =>
{
  const {state: {stacks}} = useContext(GlobalContext)
  const {query: {hostID}} = useRouter();

  if (!hostID || _.isEmpty(stacks))
    return <></>;

  const currentHost = _.find(stacks, pHost => pHost.id === hostID);
  if (!currentHost)
    return <></>;

  const InnerContainer = ({children}: { children: React.ReactNode }) =>
  {
    const {dispatch} = useContext(StackContext)

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

  return <StackProvider id={currentHost.id}>
    <InnerContainer>
      {props.children}
    </InnerContainer>
  </StackProvider>
};

export default HostLayout;
