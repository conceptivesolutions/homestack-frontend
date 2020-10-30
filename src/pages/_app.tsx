import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './_app.scss';
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import DialogContainer, {dialogStore} from "../components/dialogs/DialogContainer";
import {GlobalProvider} from "../context/GlobalContext";
import {AuthProvider} from "../context/AuthContext";

// noinspection JSUnusedGlobalSymbols
export default function App({Component, pageProps}: { Component: any, pageProps: any })
{
  return (
    <AuthProvider>
      <GlobalProvider>
        {/** @ts-ignore */}
        <GlobalHooksProvider hooks={[dialogStore]}>
          <Component {...pageProps} />
          <DialogContainer/>
        </GlobalHooksProvider>
      </GlobalProvider>
    </AuthProvider>
  )
}
