import { ButtonStripItem } from "components/base/list/ButtonStrip";
import { PageLayout } from "layouts/PageLayout";
import { LoginPage } from "pages/LoginPage";
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

/**
 * Main entry point in the whole HomeStack application
 *
 * @constructor
 */
export const App = () => (
  <BrowserRouter>
    <PageLayout stripItems={[<ButtonStripItem/>]}>
      <Switch>
        <Route path="/dashboard">
          <div>dashboard</div>
        </Route>
        <Route path="/settings">
          <div>settings</div>
        </Route>
        <Route path="/login">
          <LoginPage/>
        </Route>
        <Route path="/">
          <Redirect to={"/dashboard"}/>
        </Route>
      </Switch>
    </PageLayout>
  </BrowserRouter>
);
