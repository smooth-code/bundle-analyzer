import React from 'react'
import store from 'store'

const AuthContext = React.createContext()

function AuthProvider({ initialToken, onTokenChange, children }) {
  const [token, setToken] = React.useState(initialToken || null)
  const value = React.useMemo(
    () => ({
      token,
      setToken(token) {
        setToken(token)
        onTokenChange(token)
      },
    }),
    [token, onTokenChange],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function onTokenChange(token) {
  store.set('token', token)
}

export function AuthInitializer({ children }) {
  return (
    <AuthProvider
      initialToken={store.get('token') || null}
      onTokenChange={onTokenChange}
    >
      {children}
    </AuthProvider>
  )
}

export function useAuth() {
  return React.useContext(AuthContext)
}

export function useAuthToken() {
  const { token } = useAuth()
  return token || null
}

export function useLogout() {
  const { setToken } = useAuth()
  return React.useCallback(() => setToken(null), [setToken])
}
