import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import store from 'store'
import { AuthProvider } from './containers/AuthContext'
import { Home } from './containers/Home'
import { AuthCallback } from './containers/AuthCallback'

function onTokenChange(token) {
  store.set('token', token)
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider
        initialToken={store.get('token') || null}
        onTokenChange={onTokenChange}
      >
        <Route path="/" component={Home} />
        <Route path="/auth/github/callback" component={AuthCallback} />
      </AuthProvider>
    </BrowserRouter>
  )
}
