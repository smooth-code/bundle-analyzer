import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Normalize, Box } from '@smooth-ui/core-sc'
import {
  GlobalStyle,
  Footer,
  FooterBody,
  FooterPrimary,
  FooterSecondary,
  FooterLink,
  SmoothCodeLogo,
} from 'components'
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
                      <Box
                        minHeight="100%"
                        display="flex"
                        flexDirection="column"
                      >
                        <Box flex="0 0 auto">
                          <AppNavbar />
                        </Box>
                        <SyncAlertBar />
                        <Box flex="1 1 auto">
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
                        </Box>
                        <Box flex="0 0 auto" mt={5}>
                          <Footer>
                            <FooterBody>
                              <FooterPrimary>
                                <a
                                  href="https://www.smooth-code.com"
                                  rel="noopener noreferrer"
                                >
                                  <SmoothCodeLogo height={30} width={148} />
                                </a>
                              </FooterPrimary>
                              <FooterSecondary>
                                <FooterLink href="/terms">Terms</FooterLink>
                                <FooterLink href="/terms">Privacy</FooterLink>
                                <FooterLink href="/terms">Security</FooterLink>
                                <FooterLink href="/terms">Docs</FooterLink>
                              </FooterSecondary>
                            </FooterBody>
                          </Footer>
                        </Box>
                      </Box>
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
