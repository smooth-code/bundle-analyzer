import React from 'react'
import axios from 'axios'
import { Box } from '@smooth-ui/core-sc'
import {
  Container,
  Card,
  CardHeader,
  CardStat,
  FileSize,
} from '../../components'
import {
  getTotalAssetsSize,
  getTotalChunksNumber,
  getTotalModulesNumber,
  getTotalAssetsNumber,
} from '../../modules/stats'
import { useRepository } from './RepositoryContext'

function StatsLoader({ url, children }) {
  const [stats, setStats] = React.useState(null)
  React.useEffect(() => {
    axios.get(url).then(response => {
      setStats(response.data)
    })
  }, [url])

  if (!stats) return null
  return children(stats)
}

export function RepositoryOverview() {
  const repository = useRepository()
  return (
    <StatsLoader url={repository.overviewBundleInfo.webpackStatsUrl}>
      {stats => (
        <Container my={4}>
          <Box>
            <Box row mx={-2}>
              <Box col px={2}>
                <Card backgroundColor="light.green">
                  <CardHeader>Total size</CardHeader>
                  <CardStat>
                    <FileSize>{getTotalAssetsSize(stats)}</FileSize>
                  </CardStat>
                </Card>
              </Box>
              <Box col px={2}>
                <Card backgroundColor="light.blue">
                  <CardHeader>Chunks</CardHeader>
                  <CardStat>{getTotalChunksNumber(stats)}</CardStat>
                </Card>
              </Box>
              <Box col px={2}>
                <Card backgroundColor="light.violet">
                  <CardHeader>Modules</CardHeader>
                  <CardStat>{getTotalModulesNumber(stats)}</CardStat>
                </Card>
              </Box>
              <Box col px={2}>
                <Card backgroundColor="light.pink">
                  <CardHeader>Assets</CardHeader>
                  <CardStat>{getTotalAssetsNumber(stats)}</CardStat>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </StatsLoader>
  )
}
