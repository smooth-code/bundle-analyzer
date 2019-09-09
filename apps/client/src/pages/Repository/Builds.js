/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import gql from 'graphql-tag'
import { Box } from '@xstyled/styled-components'
import { Query } from 'containers/Apollo'
import { Link } from 'react-router-dom'
import { Container, Card, CardBody, FadeLink } from 'components'
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
                number
                commit
                branch
              }
            }
          }
        }
      `}
      variables={{ ownerLogin: repository.owner.login, name: repository.name }}
    >
      {({ repository: { builds } }) => {
        return (
          <Container my={4}>
            {builds.edges.map(build => (
              <Box col={1} py={2} key={build.id}>
                <Card>
                  <CardBody p={2}>
                    <FadeLink
                      forwardedAs={Link}
                      color="white"
                      to={`/gh/${repository.owner.login}/${repository.name}/builds/${build.number}`}
                    >
                      {build.number}
                    </FadeLink>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </Container>
        )
      }}
    </Query>
  )
}
