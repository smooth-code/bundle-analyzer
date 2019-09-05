import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { Normalize } from '@smooth-ui/core-sc'
import { GlobalStyle } from './components'
import { AuthInitializer } from './containers/Auth'
import { ApolloInitializer } from './containers/Apollo'
import { ThemeInitializer } from './containers/Theme'
import { UserInitializer } from './containers/User'
import { AppNavbar } from './containers/AppNavbar'
import { Home } from './pages/Home'
import { Repository } from './pages/Repository'
import { AuthCallback } from './pages/AuthCallback'

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
              <Route exact path="/" component={Home} />
              <Route
                path="/gh/:ownerLogin/:repositoryName"
                component={Repository}
              />
              <Route path="/auth/github/callback" component={AuthCallback} />
            </UserInitializer>
          </ApolloInitializer>
        </AuthInitializer>
      </BrowserRouter>
    </ThemeInitializer>
  )
}
