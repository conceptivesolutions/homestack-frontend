import { PageLayout } from "layouts/PageLayout";
import { useAuth } from "models/states/AuthState";
import { ErrorPage } from "pages/ErrorPage";
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
          {/* Public Routes */}
          <Route path="/login" exact>
            <LoginPage/>
          </Route>

          {/* Private Routes */}
          <PrivateRoute path="/" exact>
            <Redirect to={"/dashboard"}/>
          </PrivateRoute>
          <PrivateRoute path="/dashboard" exact>
            <div>dashboard</div>
          </PrivateRoute>
          <PrivateRoute path="/settings" exact>
            <div>settings</div>
          </PrivateRoute>
          <PrivateRoute path="/">
            <ErrorPage/>
          </PrivateRoute>
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
