import gql from 'graphql-tag'
import { Build } from '../../models'
import { getSizeReport } from '../../modules/size-check'
import { getRepository } from './Repository'

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

  enum Compression {
    gzip
    brotli
    none
  }

  type SizeReport {
    conclusion: BuildConclusion!
    checks: [SizeReportCheck!]!
  }

  type SizeReportCheck {
    name: String!
    conclusion: BuildConclusion!
    compareSize: Int!
    compareMaxSize: Int!
    compareCompression: Compression!
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
    sizeReport: SizeReport
    repository: Repository!
  }

  type BuildResult {
    pageInfo: PageInfo!
    edges: [Build!]!
  }

  extend type Query {
    build(ownerLogin: String!, repositoryName: String!, number: Int!): Build
  }
`

export const resolvers = {
  Build: {
    async webpackStatsUrl(build) {
      return Build.getWebpackStatsGetUrl(build.id)
    },
    async sizeReport(build) {
      return getSizeReport(build)
    },
    async repository(build) {
      return build.$relatedQuery('repository')
    },
  },
  Query: {
    async build(rootObj, { ownerLogin, repositoryName, number }, context) {
      const repository = await getRepository({
        ownerLogin,
        name: repositoryName,
        user: context.user,
      })
      if (!repository) return null
      return repository
        .$relatedQuery('builds')
        .where({ number })
        .first()
    },
  },
}
