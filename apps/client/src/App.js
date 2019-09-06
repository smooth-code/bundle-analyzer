import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Normalize } from '@smooth-ui/core-sc'
import { GlobalStyle } from 'components'
import { AuthInitializer } from 'containers/Auth'
import { ApolloInitializer } from 'containers/Apollo'
import { ThemeInitializer } from 'containers/Theme'
import { UserInitializer } from 'containers/User'
import { AppNavbar } from 'containers/AppNavbar'
import { Home } from 'pages/Home'
import { Owner } from 'pages/Owner'
import { Repository } from 'pages/Repository'
import { AuthCallback } from 'pages/AuthCallback'

export function App() {
  return (
    <ThemeInitializer>
      <BrowserRouter>
        <AuthInitializer>
          <ApolloInitializer>
            <UserInitializer>
              <AppNavbar />
              <Normalize />
              <GlobalStyle />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/gh/:ownerLogin" component={Owner} />
                <Route exact path="/account/gh/:ownerLogin" component={Owner} />
                <Route
                  path="/gh/:ownerLogin/:repositoryName"
                  component={Repository}
                />
                <Route path="/auth/github/callback" component={AuthCallback} />
              </Switch>
            </UserInitializer>
          </ApolloInitializer>
        </AuthInitializer>
      </BrowserRouter>
    </ThemeInitializer>
  )
}
