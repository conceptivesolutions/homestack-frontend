import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.scss';
import {GlobalHooksProvider} from "@devhammed/use-global-hook";
import DialogContainer, {dialogStore} from "../components/dialogs/DialogContainer";
import {GlobalProvider} from "../state/GlobalContext";

// noinspection JSUnusedGlobalSymbols
export default function App({Component, pageProps})
{
  return (
    <GlobalProvider>
      <GlobalHooksProvider hooks={[dialogStore]}>
        <Component {...pageProps} />
        <DialogContainer/>
      </GlobalHooksProvider>
    </GlobalProvider>
  )
}
