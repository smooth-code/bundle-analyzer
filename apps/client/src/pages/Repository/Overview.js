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
  CardBody,
  CardTitle,
} from 'components'
import {
  getTotalAssetsSize,
  getTotalChunksNumber,
  getTotalModulesNumber,
  getTotalAssetsNumber,
} from 'modules/stats'
import { StatsLoader } from 'containers/StatsLoader'
import { useRepository } from './RepositoryContext'
import { RepositoryEmpty } from './Empty'

const Table = styled.tableBox`
  color: white;
  border-collapse: collapse;
  width: 100%;

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
  if (!repository.overviewBuild) {
    return <RepositoryEmpty />
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
            <Box col={{ xs: 1, md: 1 / 4 }} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Total size</CardTitle>
                </CardHeader>
                <CardStat>
                  <FileSize>{getTotalAssetsSize(stats)}</FileSize>
                </CardStat>
              </Card>
            </Box>
            <Box col={{ xs: 1, md: 1 / 4 }} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Chunks</CardTitle>
                </CardHeader>
                <CardStat>{getTotalChunksNumber(stats)}</CardStat>
              </Card>
            </Box>
            <Box col={{ xs: 1, md: 1 / 4 }} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Modules</CardTitle>
                </CardHeader>
                <CardStat>{getTotalModulesNumber(stats)}</CardStat>
              </Card>
            </Box>
            <Box col={{ xs: 1, md: 1 / 4 }} p={2}>
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
                  <Box style={{ overflowX: 'auto' }}>
                    <Table>
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
                  </Box>
                </CardBody>
              </Card>
            </Box>
            <Box col={1} p={2}>
              <Card color="white">
                <CardHeader>
                  <CardTitle>Chunks</CardTitle>
                </CardHeader>
                <CardBody>
                  <Box style={{ overflowX: 'auto' }}>
                    <Table>
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
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>
        )}
      </StatsLoader>
    </Container>
  )
}
