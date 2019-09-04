import gql from 'graphql-tag'
import { BundleInfo } from '../../models'

export const typeDefs = gql`
  type BundleInfo {
    id: ID!
    branch: String!
    commit: String!
    webpackStatsUrl: String!
  }
`

export const resolvers = {
  BundleInfo: {
    async webpackStatsUrl(bundleInfo) {
      return BundleInfo.getWebpackStatsGetUrl(bundleInfo.id)
    },
  },
}
