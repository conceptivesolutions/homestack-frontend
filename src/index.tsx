import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { App } from '_app';
import 'index.scss';
import React from 'react';
import ReactDOM from 'react-dom';

// init sentry, if we are in production mode
if (process.env.NODE_ENV === "production")
  Sentry.init({
    dsn: "https://7574a3d5436b420497dcdca9f91090bd@o532873.ingest.sentry.io/5652316",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1,
  });

ReactDOM.render(
  <App/>,
  document.getElementById('root'),
);
