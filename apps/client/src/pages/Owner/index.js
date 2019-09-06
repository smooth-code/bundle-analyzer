import React from 'react'
import gql from 'graphql-tag'
import { Route } from 'react-router-dom'
import { Box } from '@xstyled/styled-components'
import { FaGithub } from 'react-icons/fa'
import {
  Header,
  HeaderBody,
  HeaderTitle,
  HeaderPrimary,
  HeaderSecondaryLink,
  TabList,
  RouterTabItem,
} from 'components'
import { Query } from 'containers/Apollo'
import { OwnerAvatar } from 'containers/OwnerAvatar'
import { hasWritePermission } from 'modules/permissions'
import { OwnerProvider, useOwner } from './OwnerContext'
import { OwnerRepositories } from './Repositories'
import { OwnerSettings } from './Settings'

function OwnerHeader() {
  const owner = useOwner()
  return (
    <Header>
      <HeaderBody>
        <HeaderPrimary>
          <HeaderTitle>
            <OwnerAvatar owner={owner} mr={2} />
            {owner.login}
          </HeaderTitle>
          <HeaderSecondaryLink href={`https://github.com/${owner.login}`}>
            <Box forwardedAs={FaGithub} mr={1} /> {owner.login}
          </HeaderSecondaryLink>
        </HeaderPrimary>
        <TabList>
          <RouterTabItem exact to={`/gh/${owner.login}`}>
            Repositories
          </RouterTabItem>
          {hasWritePermission(owner) ? (
            <RouterTabItem to={`/account/gh/${owner.login}`}>
              Settings
            </RouterTabItem>
          ) : null}
        </TabList>
      </HeaderBody>
    </Header>
  )
}

export function Owner({
  match: {
    params: { ownerLogin },
  },
}) {
  return (
    <Query
      query={gql`
        query Owner($login: String!) {
          owner(login: $login) {
            id
            name
            login
            permissions
          }
        }
      `}
      variables={{ login: ownerLogin }}
    >
      {({ owner }) => (
        <OwnerProvider owner={owner}>
          <>
            <OwnerHeader />
            <Route
              exact
              path={`/gh/${owner.login}`}
              component={OwnerRepositories}
            />
            {hasWritePermission(owner) ? (
              <Route
                path={`/account/gh/${ownerLogin}`}
                component={OwnerSettings}
              />
            ) : null}
          </>
        </OwnerProvider>
      )}
    </Query>
  )
}
