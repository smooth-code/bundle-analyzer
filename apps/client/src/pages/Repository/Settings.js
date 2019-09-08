import React from 'react'
import gql from 'graphql-tag'
import { Box, Boxer, Button, Input } from '@smooth-ui/core-sc'
import { FaCheck } from 'react-icons/fa'
import { useMutation } from '@apollo/react-hooks'
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Code,
} from '../../components'
import { useRepository } from './RepositoryContext'

function BaselineBranch() {
  const repository = useRepository()
  const [baselineBranch, setBaselineBranch] = React.useState(
    repository.baselineBranch,
  )
  const [pristine, setPristine] = React.useState(true)
  const [updateRepository, { data }] = useMutation(gql`
    mutation UpdateRepository($repository: RepositoryUpdate!) {
      updateRepository(repository: $repository) {
        id
      }
    }
  `)
  React.useEffect(() => {
    if (pristine) return
    updateRepository({
      variables: { repository: { id: repository.id, baselineBranch } },
    }).catch(error => {
      console.error(error)
      // TODO Sentry
    })
  }, [repository.id, baselineBranch, updateRepository, pristine])
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
              if (pristine) {
                setPristine(false)
              }
            }}
            maxWidth={200}
          />
          {data && data.updateRepository ? (
            <Box forwardedAs={FaCheck} color="success" ml={2} />
          ) : null}
        </Box>
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
