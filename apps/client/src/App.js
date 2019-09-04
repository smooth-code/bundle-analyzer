import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import store from 'store'
import { AuthProvider, useAuthToken } from './containers/AuthContext'
import { ApolloProvider } from './containers/Apollo'
import { Home } from './containers/Home'
import { Repository } from './containers/Repository'
import { AuthCallback } from './containers/AuthCallback'

function onTokenChange(token) {
  store.set('token', token)
}

function ApolloInitializer({ children }) {
  const authToken = useAuthToken()
  return <ApolloProvider authToken={authToken}>{children}</ApolloProvider>
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider
        initialToken={store.get('token') || null}
        onTokenChange={onTokenChange}
      >
        <ApolloInitializer>
          <Route exact path="/" component={Home} />
          <Route
            path="/gh/:ownerLogin/:repositoryName"
            component={Repository}
          />
          <Route path="/auth/github/callback" component={AuthCallback} />
        </ApolloInitializer>
      </AuthProvider>
    </BrowserRouter>
  )
}
