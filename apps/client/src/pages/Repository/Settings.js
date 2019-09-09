import React from 'react'
import { Box, Boxer, Button, Input } from '@smooth-ui/core-sc'
import { FaCheck } from 'react-icons/fa'
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Code,
} from '../../components'
import { useRepository, useUpdateRepository } from './RepositoryContext'

function BaselineBranch() {
  const repository = useRepository()
  const updateRepository = useUpdateRepository()
  const [updated, setUpdated] = React.useState(false)
  const [baselineBranch, setBaselineBranch] = React.useState(
    repository.baselineBranch,
  )

  return (
    <Card>
      <CardBody>
        <CardTitle>Baseline branch</CardTitle>
        <CardText>
          The baseline branch is the branch displayed on overview.
        </CardText>
        <Box display="flex" alignItems="center">
          <Input
            value={baselineBranch}
            onChange={event => {
              setBaselineBranch(event.target.value)
              updateRepository({
                variables: {
                  repository: {
                    id: repository.id,
                    baselineBranch: event.target.value,
                  },
                },
              }).then(() => setUpdated(true))
            }}
            maxWidth={200}
          />
          {updated ? (
            <Box forwardedAs={FaCheck} color="success" ml={2} />
          ) : null}
        </Box>
      </CardBody>
    </Card>
  )
}

function Archive() {
  const repository = useRepository()
  const updateRepository = useUpdateRepository()

  if (!repository.active) return null

  return (
    <Card>
      <CardBody>
        <CardTitle>Archive project</CardTitle>
        <CardText>
          When your project is archived, it is still accessible but not shown on
          the homepage.
        </CardText>
        <Button
          onClick={() => {
            updateRepository({
              variables: {
                repository: {
                  id: repository.id,
                  archived: !repository.archived,
                },
              },
            })
          }}
          variant="primary"
        >
          {repository.archived ? 'Unarchive project' : 'Archive project'}
        </Button>
      </CardBody>
    </Card>
  )
}

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
        <BaselineBranch />
        <Archive />
      </Boxer>
    </Container>
  )
}
