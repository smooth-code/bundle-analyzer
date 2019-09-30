import gql from 'graphql-tag'
import { getSizeReport } from 'modules/build'
import { getRepository } from './Repository'

export const typeDefs = gql`
  enum BuildConclusion {
    success
    failure
    neutral
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

  type BundleStatsAsset {
    name: String!
    size: Int!
    gzipSize: Int!
    brotliSize: Int!
    chunkNames: [String!]!
  }

  type BundleStats {
    assets: [BundleStatsAsset!]!
    chunksNumber: Int!
    modulesNumber: Int!
  }

  type Bundle {
    id: ID!
    webpackStatsUrl: String!
    stats: BundleStats!
  }

  type Build {
    id: ID!
    createdAt: DateTime!
    branch: String!
    commit: String!
    number: Int!
    jobStatus: JobStatus!
    conclusion: BuildConclusion
    commitInfo: Commit!
    sizeReport: SizeReport
    repository: Repository!
    bundle: Bundle!
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
  Bundle: {
    async webpackStatsUrl(bundle) {
      return bundle.getWebpackStatsGetUrl()
    },
  },
  Build: {
    async sizeReport(build) {
      return getSizeReport(build)
    },
    async repository(build) {
      return build.$relatedQuery('repository')
    },
    async bundle(build) {
      return build.$relatedQuery('bundle')
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
