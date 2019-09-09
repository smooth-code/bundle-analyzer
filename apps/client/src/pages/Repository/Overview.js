/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import styled, { Box } from '@xstyled/styled-components'
import {
  Container,
  Card,
  CardHeader,
  CardStat,
  FileSize,
  CardBody,
  CardTitle,
} from 'components'
import { getTotalAssetsSize } from 'modules/stats'
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
  const { stats } = repository.overviewBuild
  return (
    <Container my={4} position="relative">
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
            <CardStat>{stats.chunksNumber}</CardStat>
          </Card>
        </Box>
        <Box col={{ xs: 1, md: 1 / 4 }} p={2}>
          <Card color="white">
            <CardHeader>
              <CardTitle>Modules</CardTitle>
            </CardHeader>
            <CardStat>{stats.modulesNumber}</CardStat>
          </Card>
        </Box>
        <Box col={{ xs: 1, md: 1 / 4 }} p={2}>
          <Card color="white">
            <CardHeader>
              <CardTitle>Assets</CardTitle>
            </CardHeader>
            <CardStat>{stats.assets.length}</CardStat>
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
                      <th style={{ width: 120 }}>Size (gz)</th>
                      <th style={{ width: 120 }}>Size (br)</th>
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
                        <td>
                          <FileSize>{asset.gzipSize}</FileSize>
                        </td>
                        <td>
                          <FileSize>{asset.brotliSize}</FileSize>
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
    </Container>
  )
}
