import React from 'react'
import { Link, Route } from 'react-router-dom'
import styled from '@xstyled/styled-components'

export const TabList = styled.ul`
  padding: 0;
  margin: 0;
  margin-bottom: -1rpx;
  list-style-type: none;
  display: flex;
  font-weight: medium;
  font-size: 14;
`

export const TabItem = styled.li`
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

export const TabItemLink = styled.a`
  color: white;
  text-decoration: none;
  padding: 3;
  display: block;
`

export function RouterTabItem({ children, exact, to }) {
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
