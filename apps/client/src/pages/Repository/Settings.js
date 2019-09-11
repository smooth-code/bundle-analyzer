import React from 'react'
import { Box, Boxer, Button, Input, Textarea } from '@smooth-ui/core-sc'
import { FaCheck, FaTimes } from 'react-icons/fa'
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Code,
} from '../../components'
import { useRepository, useUpdateRepository } from './RepositoryContext'

function SmallAlert({ variant, ...props }) {
  switch (variant) {
    case 'updated':
      return (
        <Box role="alert" fontSize={12} {...props}>
          <Box forwardedAs={FaCheck} color="success" mr={1} />
          Saved
        </Box>
      )
    case 'invalid':
      return (
        <Box role="alert" fontSize={12} {...props}>
          <Box forwardedAs={FaTimes} color="danger" mr={1} />
          Invalid
        </Box>
      )
    default:
      return null
  }
}

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
          {updated ? <SmallAlert ml={2} variant="updated" /> : null}
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

function isValidSizeCheckConfig(value) {
  try {
    const obj = JSON.parse(value)
    if (!obj) return false
    if (!obj.files) return false
    if (!Array.isArray(obj.files)) return false
    if (!obj.files.every(fileRule => fileRule.test && fileRule.maxSize))
      return false
    return true
  } catch (error) {
    return false
  }
}

function SizeCheck() {
  const repository = useRepository()
  const updateRepository = useUpdateRepository()
  const [sizeCheckConfig, setSizeCheckConfig] = React.useState(
    repository.sizeCheckConfig,
  )
  const [updated, setUpdated] = React.useState(false)
  const [invalid, setInvalid] = React.useState(false)

  return (
    <Card>
      <CardBody>
        <CardTitle>Size check</CardTitle>
        <CardText>Configuration of size checks.</CardText>
        <Textarea
          value={sizeCheckConfig}
          onChange={event => {
            const { value } = event.target
            setSizeCheckConfig(value)
            if (isValidSizeCheckConfig(value)) {
              setInvalid(false)
              updateRepository({
                variables: {
                  repository: {
                    id: repository.id,
                    sizeCheckConfig: value,
                  },
                },
              }).then(() => setUpdated(true))
            } else {
              setInvalid(true)
            }
          }}
          rows={10}
        />
        {invalid ? (
          <SmallAlert mt={2} variant="invalid" />
        ) : updated ? (
          <SmallAlert mt={2} variant="updated" />
        ) : null}
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
            <Code>BUNDLE_ANALYZER_TOKEN={repository.token}</Code>
          </CardBody>
        </Card>
        <BaselineBranch />
        <SizeCheck />
        <Archive />
        <Card>
          <CardBody>
            <CardTitle>Delete project</CardTitle>
            <CardText>
              To delete project, remove the access from your GitHub app.
            </CardText>
            <Button
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={process.env.GITHUB_APP_URL}
            >
              Continue to GitHub to manage repository integration
            </Button>
          </CardBody>
        </Card>
      </Boxer>
    </Container>
  )
}
