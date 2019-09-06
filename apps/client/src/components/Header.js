import styled from '@xstyled/styled-components'
import { Container } from './Container'
import { FadeLink } from './Link'

export const Header = styled.header`
  background-color: gray800;
  color: white;
  border-top: 1;
  border-bottom: 1;
  border-color: gray700;
`

export const HeaderTitle = styled.h2`
  margin: 4 0;
  font-weight: 300;
  display: flex;
  align-items: center;
  flex: 1;
`

export const HeaderPrimary = styled.div`
  display: flex;
  align-items: center;
`

export const HeaderSecondaryLink = styled(FadeLink)`
  font-size: 14;
  display: flex;
  align-items: center;
  color: white;
`

export const HeaderBody = Container
