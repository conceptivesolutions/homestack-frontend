import React from 'react';
import HostLayout from "./HostLayout";
import {SatelliteProvider} from "../context/SatelliteContext";
import {useRouter} from "next/router";

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
      <HostLayout>
        {props.children}
      </HostLayout>
    </SatelliteProvider>
  );
};

export default SatelliteLayout;
