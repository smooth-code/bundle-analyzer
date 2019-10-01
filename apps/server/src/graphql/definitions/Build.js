import gql from 'graphql-tag'
import { getSizeLimitReport, getSizeDiffReport } from 'modules/build'
import { getRepository } from './Repository'

export const typeDefs = gql`
  enum Conclusion {
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

  type SizeLimitReport {
    conclusion: Conclusion!
    checks: [SizeLimitReportCheck!]!
  }

  type SizeLimitReportCheck {
    name: String!
    conclusion: Conclusion!
    compareSize: Int!
    compareMaxSize: Int!
    compareCompression: Compression!
  }

  enum SizeDiffResult {
    baseline
    noBaseline
    diff
  }

  type Asset {
    name: String!
    size: Int!
    gzipSize: Int!
    brotliSize: Int!
  }

  type SizeDiffReportComparison {
    name: String!
    asset: Asset!
    baseAsset: Asset
  }

  type SizeDiffReport {
    conclusion: Conclusion!
    result: SizeDiffResult!
    size: Int
    baseSize: Int
    comparisons: [SizeDiffReportComparison]
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
    conclusion: Conclusion
    commitInfo: Commit!
    sizeLimitReport: SizeLimitReport
    sizeDiffReport: SizeDiffReport
    repository: Repository!
    bundle: Bundle!
    baseBuild: Build
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
    async sizeLimitReport(build) {
      return getSizeLimitReport(build)
    },
    async sizeDiffReport(build) {
      return getSizeDiffReport(build)
    },
    async repository(build) {
      return build.$relatedQuery('repository')
    },
    async bundle(build) {
      return build.$relatedQuery('bundle')
    },
    async conclusion(build) {
      await build.$loadRelated('checks')
      if (build.checks.some(check => check.conclusion === 'failure'))
        return 'failure'
      if (build.checks.some(check => check.conclusion === 'success'))
        return 'success'
      return 'neutral'
    },
    async baseBuild(build) {
      return build.$relatedQuery('baseBuild')
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
