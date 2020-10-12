import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavigationComponent from "./netplan/components/navbar/NavigationComponent";
import NetworkComponent from "./netplan/components/network/NetworkComponent";
import DialogContainer, {dialogStore} from "./netplan/components/dialogs/DialogContainer";
import {GlobalHooksProvider} from "@devhammed/use-global-hook";

export default function App()
{
  return (
    // @ts-ignore
    <GlobalHooksProvider hooks={[dialogStore]}>
      <NavigationComponent/>
      <NetworkComponent/>
      <DialogContainer/>
    </GlobalHooksProvider>
  );
};
