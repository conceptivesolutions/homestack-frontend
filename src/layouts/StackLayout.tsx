import {mdiRefresh} from "@mdi/js";
import {GlobalContext} from "context/GlobalContext";
import {ACTION_RELOAD, StackContext, StackProvider} from "context/StackContext";
import _ from "lodash";
import {useRouter} from "next/router";
import React, {useContext} from 'react';
import PageContainer from "widgets/page/PageContainer";

interface IStackLayout
{
  children?: React.ReactNode,
}

const StackLayout = (props: IStackLayout) =>
{
  const {state: {stacks}} = useContext(GlobalContext)
  const {query: {stackID}} = useRouter();

  if (!stackID || _.isEmpty(stacks))
    return <></>;

  const currentStack = _.find(stacks, pStack => pStack.id === stackID);
  if (!currentStack)
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

  return <StackProvider id={currentStack.id}>
    <InnerContainer>
      {props.children}
    </InnerContainer>
  </StackProvider>
};

export default StackLayout;
