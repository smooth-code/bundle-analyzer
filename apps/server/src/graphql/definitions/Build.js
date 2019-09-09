import gql from 'graphql-tag'
import { Build } from '../../models'

export const typeDefs = gql`
  type BuildStatAsset {
    name: String!
    size: Int!
    gzipSize: Int!
    brotliSize: Int!
    chunkNames: [String!]!
  }

  type BuildStat {
    assets: [BuildStatAsset!]!
    chunksNumber: Int!
    modulesNumber: Int!
  }

  type Build {
    id: ID!
    branch: String!
    commit: String!
    number: Int!
    webpackStatsUrl: String!
    stats: BuildStat!
  }

  type BuildResult {
    pageInfo: PageInfo!
    edges: [Build!]!
  }
`

export const resolvers = {
  Build: {
    async webpackStatsUrl(build) {
      return Build.getWebpackStatsGetUrl(build.id)
    },
  },
}
