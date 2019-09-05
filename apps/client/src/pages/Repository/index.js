import React from 'react'
import gql from 'graphql-tag'
import { Link, Route } from 'react-router-dom'
import styled, { Box } from '@xstyled/styled-components'
import { FaGithub } from 'react-icons/fa'
import { Query } from '../../containers/Apollo'
import { useRouter } from '../../containers/Router'
import { Container } from '../../components'
import { RepositoryProvider, useRepository } from './RepositoryContext'
import { RepositoryOverview } from './Overview'
import { RepositoryBuilds } from './Builds'
import { RepositorySettings } from './Settings'

const Header = styled.header`
  background-color: gray800;
  color: white;
  border-top: 1;
  border-bottom: 1;
  border-color: gray700;
`

const Title = styled.h2`
  margin: 4 0;
  font-weight: 300;
  display: flex;
  align-items: center;
`

const TabList = styled.ul`
  padding: 0;
  margin: 0;
  margin-bottom: -1rpx;
  list-style-type: none;
  display: flex;
  font-weight: medium;
  font-size: 14;
`

const TabItem = styled.li`
  padding: 0;
  margin: 0;
  border-bottom: 1;
  border-color: transparent;
  transition: base;
  transition-property: border-color;

  &[aria-current='true'] {
    border-color: white;
  }
`

const TabItemLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 3;
  display: block;
`

function Tab({ children, exact, to }) {
  return (
    <Route exact={exact} path={to}>
      {({ match }) => (
        <TabItem aria-current={Boolean(match)}>
          <TabItemLink as={Link} to={to}>
            {children}
          </TabItemLink>
        </TabItem>
      )}
    </Route>
  )
}

function hasWritePermission(repository) {
  return repository.permissions.includes('write')
}

function RepositoryHeader() {
  const repository = useRepository()
  const { match } = useRouter()
  return (
    <Header>
      <Container>
        <Title>
          <Box
            as="a"
            href={`https://github.com/${repository.owner.login}/${repository.name}`}
            mr={2}
            color="white"
          >
            <FaGithub />
          </Box>
          {repository.owner.login}/{repository.name}
        </Title>
        <TabList>
          <Tab exact to={match.url}>
            Overview
          </Tab>
          <Tab to={`${match.url}/builds`}>Builds</Tab>
          {hasWritePermission(repository) ? (
            <Tab to={`${match.url}/settings`}>Settings</Tab>
          ) : null}
        </TabList>
      </Container>
    </Header>
  )
}

export function Repository({
  match: {
    url,
    params: { ownerLogin, repositoryName },
  },
}) {
  return (
    <Query
      query={gql`
        query Repository($ownerLogin: String!, $repositoryName: String!) {
          repository(ownerLogin: $ownerLogin, repositoryName: $repositoryName) {
            name
            token
            permissions
            owner {
              name
              login
            }
            overviewBundleInfo {
              id
              webpackStatsUrl
            }
          }
        }
      `}
      variables={{ ownerLogin, repositoryName }}
    >
      {({ repository }) => (
        <RepositoryProvider repository={repository}>
          <>
            <RepositoryHeader />
            <Route exact path={url} component={RepositoryOverview} />
            <Route path={`${url}/builds`} component={RepositoryBuilds} />
            {hasWritePermission(repository) ? (
              <Route path={`${url}/settings`} component={RepositorySettings} />
            ) : null}
          </>
        </RepositoryProvider>
      )}
    </Query>
  )
}
