import React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Normalize } from '@smooth-ui/core-sc'
import { ScrollToTop, GoogleAnalytics } from 'containers/Router'
import {
  GlobalStyle,
  Layout,
  LayoutHeader,
  LayoutMain,
  LayoutFooter,
  Markdown,
} from 'components'
import { AuthInitializer } from 'containers/Auth'
import { ApolloInitializer } from 'containers/Apollo'
import { ThemeInitializer } from 'containers/Theme'
import { UserInitializer } from 'containers/User'
import { SyncAlertBar } from 'containers/SyncAlertBar'
import { AppNavbar } from 'containers/AppNavbar'
import { AppFooter } from 'containers/AppFooter'
import { Home } from 'pages/Home'
import { Owner } from 'pages/Owner'
import { Repository } from 'pages/Repository'
import { AuthCallback } from 'pages/AuthCallback'
import { NotFound } from 'pages/NotFound'
import Privacy from 'pages/Privacy.md'
import Terms from 'pages/Terms.md'

export function App() {
  return (
    <ThemeInitializer>
      <>
        <Helmet defaultTitle="Bundle Analyzer" />
        <Normalize />
        <GlobalStyle />
        <BrowserRouter>
          <ScrollToTop />
          <GoogleAnalytics />
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
                      <Layout>
                        <LayoutHeader>
                          <AppNavbar />
                        </LayoutHeader>
                        <SyncAlertBar />
                        <LayoutMain>
                          <Switch>
                            <Route exact path="/" component={Home} />
                            <Redirect exact path="/gh" to="/" />
                            <Route
                              exact
                              path="/privacy"
                              render={() => (
                                <Markdown title="Privacy">{Privacy}</Markdown>
                              )}
                            />
                            <Route
                              exact
                              path="/terms"
                              render={() => (
                                <Markdown title="Terms">{Terms}</Markdown>
                              )}
                            />
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
                        </LayoutMain>
                        <LayoutFooter>
                          <AppFooter />
                        </LayoutFooter>
                      </Layout>
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
