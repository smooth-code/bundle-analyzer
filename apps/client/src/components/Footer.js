import React from 'react'
import styled from '@xstyled/styled-components'
import { Container } from './Container'
import { FadeLink } from './Link'

export const Footer = styled.footer`
  background-color: gray800;
  color: white;
  border-top: 1;
  border-color: gray700;
  font-size: 12;
`

export function FooterBody(props) {
  return (
    <Container
      p={3}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      {...props}
    />
  )
}

export const FooterPrimary = styled.div``
export const FooterSecondary = styled.div`
  margin: 0 -2;
`
export function FooterLink(props) {
  return <FadeLink mx={2} color="white" {...props} />
}
