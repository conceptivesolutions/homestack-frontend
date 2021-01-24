import { PageLayout } from "layouts/PageLayout";
import { useAuth } from "models/states/AuthState";
import { LoginPage } from "pages/LoginPage";
import React from 'react';
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { RecoilRoot } from "recoil";

/**
 * Main entry point in the whole HomeStack application
 *
 * @constructor
 */
export const App = () => (
  <RecoilRoot>
    <BrowserRouter>
      <PageLayout>
        <Switch>
          <PrivateRoute path="/dashboard">
            <div>dashboard</div>
          </PrivateRoute>
          <PrivateRoute path="/settings">
            <div>settings</div>
          </PrivateRoute>
          <Route path="/login">
            <LoginPage/>
          </Route>
          <Route path="/">
            <Redirect to={"/dashboard"}/>
          </Route>
        </Switch>
      </PageLayout>
    </BrowserRouter>
  </RecoilRoot>
);

/**
 * Route that should be used for something,
 * that should only be accessible when logged in
 * (and if a valid token is accessable)
 *
 * @param path path to reach
 * @param children
 * @constructor
 */
const PrivateRoute = ({children, ...props}: RouteProps) =>
{
  const {isAuthenticated} = useAuth();
  return (
    <Route {...props} render={({location}) => (isAuthenticated() ? children : (
      <Redirect
        to={{
          pathname: '/login',
          state: {from: location},
        }}
      />
    ))}
    />
  );
};
