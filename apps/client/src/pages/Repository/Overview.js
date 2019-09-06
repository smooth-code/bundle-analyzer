/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import styled, { Box } from '@xstyled/styled-components'
import {
  Container,
  Card,
  CardHeader,
  CardStat,
  FileSize,
  Loader,
  Code,
  CardBody,
  CardTitle,
  CardText,
} from 'components'
import {
  getTotalAssetsSize,
  getTotalChunksNumber,
  getTotalModulesNumber,
  getTotalAssetsNumber,
} from 'modules/stats'
import { StatsLoader } from 'containers/StatsLoader'
import { hasWritePermission } from 'modules/permissions'
import { useRepository } from './RepositoryContext'

const Table = styled.tableBox`
  color: white;
  border-collapse: collapse;

  thead tr {
    border-bottom: 1;
    border-color: gray700;

    th {
      padding: 2;
      text-align: left;
      font-weight: medium;
    }
  }

  tbody {
    td {
      padding: 2;
    }
  }
`

export function RepositoryOverview() {
  const repository = useRepository()
  const write = hasWritePermission(repository)
  if (!write && !repository.overviewBuild) {
    return (
      <Container textAlign="center" my={4}>
        There is no stats uploaded for this repository.
      </Container>
    )
  }
  if (write && !repository.overviewBuild) {
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
  return (
    <Container my={4} position="relative">
      <StatsLoader
        fallback={
          <Box textAlign="center">
            <Loader width="10%" height="10%" />
          </Box>
        }
        url={repository.overviewBuild.webpackStatsUrl}
      >
        {stats => (
          <Box row m={-2}>
            <Box col={1 / 4} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Total size</CardTitle>
                </CardHeader>
                <CardStat>
                  <FileSize>{getTotalAssetsSize(stats)}</FileSize>
                </CardStat>
              </Card>
            </Box>
            <Box col={1 / 4} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Chunks</CardTitle>
                </CardHeader>
                <CardStat>{getTotalChunksNumber(stats)}</CardStat>
              </Card>
            </Box>
            <Box col={1 / 4} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Modules</CardTitle>
                </CardHeader>
                <CardStat>{getTotalModulesNumber(stats)}</CardStat>
              </Card>
            </Box>
            <Box col={1 / 4} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                </CardHeader>
                <CardStat>{getTotalAssetsNumber(stats)}</CardStat>
              </Card>
            </Box>

            <Box col={1} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Chunks</th>
                        <th style={{ width: 120 }}>Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.assets.map((asset, index) => (
                        <tr key={index}>
                          <td>{asset.name}</td>
                          <td>{asset.chunkNames.length}</td>
                          <td>
                            <FileSize>{asset.size}</FileSize>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Box>
            <Box col={1} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Chunks</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Names</th>
                        <th>Files</th>
                        <th>Modules</th>
                        <th style={{ width: 120 }}>Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.chunks.map((chunk, index) => (
                        <tr key={index}>
                          <td>{chunk.names.join(', ')}</td>
                          <td>{chunk.files.join(', ')}</td>
                          <td>{chunk.modules.length}</td>
                          <td>
                            <FileSize>{chunk.size}</FileSize>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Box>
          </Box>
        )}
      </StatsLoader>
    </Container>
  )
}
