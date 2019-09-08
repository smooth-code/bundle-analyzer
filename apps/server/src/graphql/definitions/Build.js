import gql from 'graphql-tag'
import { Build } from '../../models'

export const typeDefs = gql`
  type Build {
    id: ID!
    branch: String!
    commit: String!
    webpackStatsUrl: String!
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
