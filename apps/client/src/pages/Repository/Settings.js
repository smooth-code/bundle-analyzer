import React from 'react'
import { Boxer, Button } from '@smooth-ui/core-sc'
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Code,
} from '../../components'
import { useRepository } from './RepositoryContext'

export function RepositorySettings() {
  const repository = useRepository()
  return (
    <Container>
      <Boxer my={4}>
        <Card>
          <CardBody>
            <CardTitle>Project token</CardTitle>
            <CardText>See the docs for how to set up project.</CardText>
            <pre>
              <Code>BUNDLE_ANALYZER_TOKEN={repository.token}</Code>
            </pre>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>Archive project</CardTitle>
            <CardText>
              When your project is archived, it is still accessible but not
              shown on the homepage.
            </CardText>
            <Button variant="primary">Archive project</Button>
          </CardBody>
        </Card>
      </Boxer>
    </Container>
  )
}
