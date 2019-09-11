/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import gql from 'graphql-tag'
import styled, { Box } from '@xstyled/styled-components'
import {
  Container,
  Card,
  CardHeader,
  CardStat,
  FileSize,
  CardBody,
  CardTitle,
  FadeLink,
} from 'components'
import moment from 'moment'
import { Query } from 'containers/Apollo'
import { FaRegClock } from 'react-icons/fa'
import { GoGitCommit, GoGitBranch, GoPulse } from 'react-icons/go'
import { getBuildStatus, getStatusColor } from 'modules/build'
import { StatusIcon } from 'containers/StatusIcon'
import { getTotalAssetsSize } from 'modules/stats'
// eslint-disable-next-line import/no-cycle
import { useRepository } from './RepositoryContext'
import { NotFound } from '../NotFound'

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

export const BuildDetailFragment = gql`
  fragment BuildDetailFragment on Build {
    id
    createdAt
    number
    commit
    branch
    conclusion
    jobStatus
    repository {
      id
      name
      owner {
        id
        login
      }
    }
    commitInfo {
      message
      author {
        avatarUrl
        name
        login
      }
    }
    stats {
      assets {
        name
        size
        gzipSize
        brotliSize
        chunkNames
      }
      chunksNumber
      modulesNumber
    }
    sizeReport {
      checks {
        name
        conclusion
        compareSize
        compareMaxSize
        compareCompression
      }
    }
  }
`

export function Build({ build }) {
  const { stats } = build
  const buildStatus = getBuildStatus(build)
  const buildColor = getStatusColor(buildStatus)
  return (
    <Container my={4} position="relative">
      <Box row m={-2}>
        <Box col={1} p={2}>
          <Card borderLeft={2} borderColor={buildColor}>
            <CardBody fontSize={14}>
              <Box row mx={-2}>
                <Box col="auto" px={2}>
                  <StatusIcon status={buildStatus} mt={1} />
                </Box>
                <Box col px={2}>
                  <Box color={buildColor} display="flex" alignItems="center">
                    <Box forwardedAs="strong" mr={2}>
                      {build.branch}
                    </Box>
                    <Box>{build.commitInfo.message}</Box>
                  </Box>
                  <Box mt={3}>
                    <FadeLink
                      target="_blank"
                      rel="noopener noreferer"
                      href={`https://github.com/${build.repository.owner.login}/${build.repository.name}/commit/${build.commit}`}
                      color="white"
                      display="flex"
                      alignItems="center"
                    >
                      <Box forwardedAs={GoGitCommit} mr={2} />
                      Commit {build.commit.slice(0, 7)}
                    </FadeLink>
                    <FadeLink
                      target="_blank"
                      rel="noopener noreferer"
                      href={`https://github.com/${build.repository.owner.login}/${build.repository.name}/tree/${build.branch}`}
                      color="white"
                      display="flex"
                      alignItems="center"
                    >
                      <Box forwardedAs={GoGitBranch} mr={2} />
                      Branch {build.branch}
                    </FadeLink>
                  </Box>
                  <Box mt={3} display="flex" alignItems="center">
                    <Box
                      forwardedAs="img"
                      borderRadius="base"
                      alt={build.commitInfo.author.name}
                      src={build.commitInfo.author.avatarUrl}
                      width={18}
                      height={18}
                      mr={2}
                    />
                    {build.commitInfo.author.name}
                  </Box>
                </Box>
                <Box col="auto" px={2}>
                  <Box color={buildColor} display="flex" alignItems="center">
                    <Box forwardedAs={GoPulse} mr={2} />
                    <span>
                      #{build.number} {buildStatus}
                    </span>
                  </Box>
                  <Box mt={3} display="flex" alignItems="center">
                    <Box forwardedAs={FaRegClock} mr={2} />
                    {moment(build.createdAt).fromNow()}
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
        {build.sizeReport && (
          <Box col={1} p={2}>
            <Card color="white">
              <CardHeader>
                <CardTitle>Size checks</CardTitle>
              </CardHeader>
              <CardBody>
                <Box style={{ overflowX: 'auto' }}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th style={{ width: 150 }}>Compression</th>
                        <th style={{ width: 120 }}>Size</th>
                        <th style={{ width: 120 }}>Max size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {build.sizeReport.checks.map((check, index) => (
                        <tr key={index}>
                          <Box
                            forwardedAs="td"
                            color={getStatusColor(check.conclusion)}
                          >
                            <Box display="flex" alignItems="center">
                              <StatusIcon status={check.conclusion} mr={2} />
                              {check.name}
                            </Box>
                          </Box>
                          <td>{check.compareCompression}</td>
                          <td>
                            <FileSize>{check.compareSize}</FileSize>
                          </td>
                          <td>
                            <FileSize>{check.compareMaxSize}</FileSize>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Box>
              </CardBody>
            </Card>
          </Box>
        )}
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

export function BuildDetail({
  match: {
    params: { buildNumber },
  },
}) {
  const repository = useRepository()
  return (
    <Query
      query={gql`
        query Build(
          $ownerLogin: String!
          $repositoryName: String!
          $number: Int!
        ) {
          build(
            ownerLogin: $ownerLogin
            repositoryName: $repositoryName
            number: $number
          ) {
            ...BuildDetailFragment
          }
        }

        ${BuildDetailFragment}
      `}
      variables={{
        ownerLogin: repository.owner.login,
        repositoryName: repository.name,
        number: Number(buildNumber),
      }}
    >
      {({ build }) => {
        if (!build) return <NotFound />
        return <Build build={build} />
      }}
    </Query>
  )
}
