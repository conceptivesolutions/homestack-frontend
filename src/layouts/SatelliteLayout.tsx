import StackLayout from "layouts/StackLayout";
import {useRouter} from "next/router";
import React from 'react';
import {SatelliteProvider} from "../context/SatelliteContext";

interface ISatelliteLayout
{
  children?: React.ReactNode,
}

const SatelliteLayout = (props: ISatelliteLayout) =>
{
  const {query: {satelliteID}} = useRouter();

  if (!satelliteID)
    return <></>

  return (
    <SatelliteProvider satelliteID={satelliteID as string}>
      <StackLayout>
        {props.children}
      </StackLayout>
    </SatelliteProvider>
  );
};

export default SatelliteLayout;
