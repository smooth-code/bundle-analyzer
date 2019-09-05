import React from 'react'
import gql from 'graphql-tag'
import { useAuthToken } from './Auth'
import { useQuery } from './Apollo'

const UserContext = React.createContext()

const UserQuery = gql`
  query User {
    user {
      id
      login
    }
  }
`

export function UserInitializer({ children }) {
  const token = useAuthToken()
  const { loading, data } = useQuery(UserQuery, { skip: !token })
  const user = token && !loading ? data.user : null
  if (loading && token) return null
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export function useUser() {
  return React.useContext(UserContext)
}
