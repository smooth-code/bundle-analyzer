import gql from 'graphql-tag'
import { Build } from '../../models'

export const typeDefs = gql`
  enum BuildConclusion {
    success
    failure
  }

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

  type CommitAuthor {
    id: ID!
    name: String!
    avatarUrl: String!
    login: String
  }

  type Commit {
    sha: ID!
    message: String!
    author: CommitAuthor!
  }

  type Build {
    id: ID!
    createdAt: DateTime!
    branch: String!
    commit: String!
    number: Int!
    webpackStatsUrl: String!
    stats: BuildStat!
    jobStatus: JobStatus!
    conclusion: BuildConclusion
    commitInfo: Commit!
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
