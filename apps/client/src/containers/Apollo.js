import React from 'react'
import ApolloClient from 'apollo-boost'
import {
  useQuery,
  ApolloProvider as BaseApolloProvider,
} from '@apollo/react-hooks'

export function ApolloProvider({ children, authToken }) {
  const authorization = authToken ? `Bearer ${authToken}` : null
  const apolloClient = React.useMemo(
    () =>
      new ApolloClient({
        uri: 'http://localhost:3000/graphql',
        headers: {
          authorization,
        },
      }),
    [authorization],
  )
  return (
    <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>
  )
}

export function Query({ fallback = null, children, query, ...props }) {
  const { loading, error, data } = useQuery(query, props)

  if (error) {
    throw error
  }

  if (loading) {
    return fallback
  }

  return children(data)
}
