import {AuthProvider} from "context/AuthContext";
import {GlobalProvider} from "context/GlobalContext";
import {Router} from "next/router";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React from "react";
import './_app.scss';

//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// noinspection JSUnusedGlobalSymbols
export default function App({Component, pageProps}: { Component: any, pageProps: any })
{
  const Layout = Component.Layout || EmptyLayout;

  return (
    <AuthProvider>
      <GlobalProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalProvider>
    </AuthProvider>
  )
}

const EmptyLayout = ({children}: { children: React.ReactNode }) => <>{children}</>
