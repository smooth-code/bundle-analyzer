import gql from 'graphql-tag'
import { Build } from '../../models'
import { getSizeReport } from '../../modules/size-check'
import buildJob from '../../jobs/build'
import { getRepository } from './Repository'

export const typeDefs = gql`
  enum BuildConclusion {
    success
    failure
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

  extend type Mutation {
    restartBuild(id: ID!): Build!
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
  Mutation: {
    async restartBuild(rootObj, { buildId }, { user }) {
      const build = await Build.query()
        .findById(buildId)
        .eager('repository')
      const hasWritePermission = await build.$checkReadPermission(user)
      if (!hasWritePermission) return null
      const newBuild = await Build.query().insertAndFetch({
        jobStatus: 'queued',
        repositoryId: build.repositoryId,
        bundleId: build.bundleId,
        branch: build.branch,
        commit: build.commit,
        sizeCheckConfig: build.repository.sizeCheckConfig,
        providerMetadata: {
          service: 'bundle-analyzer/restart-build',
          build: build.id,
        },
        commitInfo: build.commitInfo,
      })
      await buildJob.push(newBuild.id)
      return newBuild
    },
  },
}
