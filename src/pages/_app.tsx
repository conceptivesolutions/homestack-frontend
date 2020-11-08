import React from "react";
import './_app.scss';
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import DialogContainer, {dialogStore} from "../components/dialogs/DialogContainer";
import {GlobalProvider} from "../context/GlobalContext";
import {AuthProvider} from "../context/AuthContext";

// noinspection JSUnusedGlobalSymbols
export default function App({Component, pageProps}: { Component: any, pageProps: any })
{
  const Layout = Component.Layout || EmptyLayout;

  return (
    <AuthProvider>
      <GlobalProvider>
        {/** @ts-ignore */}
        <GlobalHooksProvider hooks={[dialogStore]}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <DialogContainer/>
        </GlobalHooksProvider>
      </GlobalProvider>
    </AuthProvider>
  )
}

const EmptyLayout = ({children}: { children: React.ReactNode }) => <>{children}</>
