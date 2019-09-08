/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import {
  Container,
  Card,
  Code,
  CardBody,
  CardTitle,
  CardText,
} from 'components'
import { hasWritePermission } from 'modules/permissions'
import { useRepository } from './RepositoryContext'

export function RepositoryEmpty() {
  const repository = useRepository()
  const write = hasWritePermission(repository)
  if (!write) {
    return (
      <Container textAlign="center" my={4}>
        There is no build for this repository.
      </Container>
    )
  }
  return (
    <Container textAlign="center" my={4}>
      <Card>
        <CardBody>
          <CardTitle>Setup Bundle Analyzer on this project</CardTitle>
          <CardText>TODO: document how to setup the project.</CardText>
          <pre>
            <Code>BUNDLE_ANALYZER_TOKEN={repository.token}</Code>
          </pre>
        </CardBody>
      </Card>
    </Container>
  )
}
