import React from 'react'
import { gql } from 'apollo-boost'
import { Query } from './Apollo'
import Monitor from '../monitor/AppDev'

export function Repository({
  match: {
    params: { ownerLogin, repositoryName },
  },
}) {
  return (
    <Query
      query={gql`
        query Repository($ownerLogin: String!, $repositoryName: String!) {
          repository(ownerLogin: $ownerLogin, repositoryName: $repositoryName) {
            name
            owner {
              name
            }
          }
        }
      `}
      variables={{ ownerLogin, repositoryName }}
    >
      {data => <Monitor />}
    </Query>
  )
}
