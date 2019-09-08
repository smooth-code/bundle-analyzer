/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'containers/Apollo'
import { Container } from 'components'
import { useRepository } from './RepositoryContext'
import { RepositoryEmpty } from './Empty'

export function RepositoryBuilds() {
  const repository = useRepository()
  if (!repository.overviewBuild) {
    return <RepositoryEmpty />
  }
  return (
    <Query
      query={gql`
        query RepositoryBuilds($ownerLogin: String!, $name: String!) {
          repository(ownerLogin: $ownerLogin, name: $name) {
            id
            builds(first: 10, after: 0) {
              pageInfo {
                totalCount
                hasNextPage
                endCursor
              }
              edges {
                id
              }
            }
          }
        }
      `}
      variables={{ ownerLogin: repository.owner.login, name: repository.name }}
    >
      {({ repository: { builds } }) => {
        return <Container my={4}>{console.log(builds)}</Container>
      }}
    </Query>
  )
}
