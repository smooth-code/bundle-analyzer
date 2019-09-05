import styled from '@xstyled/styled-components'
import { transparentize } from 'polished'
import { th } from '@xstyled/system'

export const Card = styled.box`
  border-radius: base;
  background-color: gray800;
`

export const CardBody = styled.box`
  padding: 3;
`

export const CardText = styled.p`
  font-size: 12;
`

export const CardTitle = styled.h3`
  font-size: 18;
  font-weight: medium;
  margin: 0;
  color: white;
`

export const CardHeader = styled.headerBox`
  font-size: 15;
  color: white;
  border-bottom: 1;
  border-bottom-color: ${p => transparentize(0.8, th.color('white')(p))};
  padding: 2;
`

export const CardStat = styled.box`
  font-size: 48;
  color: white;
  text-align: center;
  padding: 4;
`
