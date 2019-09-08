import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Normalize } from '@smooth-ui/core-sc'
import { GlobalStyle } from 'components'
import { AuthInitializer } from 'containers/Auth'
import { ApolloInitializer } from 'containers/Apollo'
import { ThemeInitializer } from 'containers/Theme'
import { UserInitializer } from 'containers/User'
import { SyncAlertBar } from 'containers/SyncAlertBar'
import { AppNavbar } from 'containers/AppNavbar'
import { Home } from 'pages/Home'
import { Owner } from 'pages/Owner'
import { Repository } from 'pages/Repository'
import { AuthCallback } from 'pages/AuthCallback'
import { NotFound } from 'pages/NotFound'

export function App() {
  return (
    <ThemeInitializer>
      <>
        <Normalize />
        <GlobalStyle />
        <BrowserRouter>
          <AuthInitializer>
            <ApolloInitializer>
              <UserInitializer>
                <Switch>
                  <Route
                    exact
                    path="/auth/github/callback"
                    component={AuthCallback}
                  />
                  <Route
                    render={() => (
                      <>
                        <AppNavbar />
                        <SyncAlertBar />
                        <Switch>
                          <Route exact path="/" component={Home} />
                          <Redirect exact path="/gh" to="/" />
                          <Route
                            exact
                            path="/gh/:ownerLogin"
                            component={Owner}
                          />
                          <Route
                            exact
                            path="/account/gh/:ownerLogin"
                            component={Owner}
                          />
                          <Route
                            path="/gh/:ownerLogin/:repositoryName"
                            component={Repository}
                          />
                          <Route component={NotFound} />
                        </Switch>
                      </>
                    )}
                  />
                </Switch>
              </UserInitializer>
            </ApolloInitializer>
          </AuthInitializer>
        </BrowserRouter>
      </>
    </ThemeInitializer>
  )
}
