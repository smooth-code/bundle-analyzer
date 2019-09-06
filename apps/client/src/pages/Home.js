import React from 'react'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import styled, { Box } from '@xstyled/styled-components'
import { Query } from 'containers/Apollo'
import { GoRepo } from 'react-icons/go'
import { useUser } from 'containers/User'
import { OwnerAvatar } from 'containers/OwnerAvatar'
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  FadeLink,
} from 'components'

const RepositoryList = styled.ul`
  margin: -1 0;
  padding: 0;
`

const RepositoryItem = styled.li`
  margin: 0;
  padding: 1 0;
  list-style-type: none;
`

export function Home() {
  const user = useUser()
  if (!user) return 'TODO: redirect to www'
  return (
    <Query
      query={gql`
        query Owners {
          owners {
            id
            name
            login
            type
            repositoriesNumber
            repositories(active: true) {
              id
              name
            }
          }
        }
      `}
    >
      {({ owners }) => (
        <Container my={4}>
          <Box row m={-2} justifyContent="center">
            {owners.map(owner => (
              <Box col={{ xs: 1, md: 1 / 3 }} p={2} key={owner.id}>
                <Card>
                  <CardHeader display="flex" alignItems="center">
                    <OwnerAvatar owner={owner} mr={2} />
                    <FadeLink
                      forwardedAs={Link}
                      color="white"
                      to={`/gh/${owner.login}`}
                    >
                      <CardTitle>{owner.login}</CardTitle>
                    </FadeLink>
                  </CardHeader>
                  <CardBody>
                    <RepositoryList>
                      {owner.repositories.length === 0 && (
                        <Box textAlign="center">
                          <FadeLink
                            forwardedAs={Link}
                            color="white"
                            fontSize={13}
                            to={`/gh/${owner.login}`}
                          >
                            Setup a repository
                          </FadeLink>
                        </Box>
                      )}
                      {owner.repositories.map(repository => (
                        <RepositoryItem key={repository.id}>
                          <FadeLink
                            forwardedAs={Link}
                            to={`/gh/${owner.login}/${repository.name}`}
                            color="white"
                            fontWeight="medium"
                            fontSize={16}
                          >
                            {repository.name}
                          </FadeLink>
                        </RepositoryItem>
                      ))}
                    </RepositoryList>
                  </CardBody>
                  <CardFooter>
                    <Box display="flex" alignItems="center" fontSize={12}>
                      <Box forwardedAs={GoRepo} mr={1} />
                      {owner.repositoriesNumber} repositories
                    </Box>
                  </CardFooter>
                </Card>
              </Box>
            ))}
          </Box>
        </Container>
      )}
    </Query>
  )
}
