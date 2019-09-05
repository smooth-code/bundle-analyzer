import gql from 'graphql-tag'
import { Repository, BundleInfo } from '../../models'
import { getOwner } from './Owner'

export const typeDefs = gql`
  enum RepositoryPermission {
    read
    write
  }

  type Repository {
    id: ID!
    name: String!
    token: ID
    "Owner of the repository"
    owner: Owner!
    overviewBundleInfo: BundleInfo
    permissions: [RepositoryPermission]!
  }

  extend type Query {
    "Get a repository"
    repository(ownerLogin: String!, repositoryName: String!): Repository
  }
`

export const resolvers = {
  Repository: {
    async token(repository, args, context) {
      const hasWritePermission = Repository.checkWritePermission(
        repository,
        context.user,
      )
      if (!hasWritePermission) return null
      return repository.token
    },
    async owner(repository) {
      return repository.$relatedOwner()
    },
    async overviewBundleInfo(repository) {
      return BundleInfo.query()
        .where({
          repositoryId: repository.id,
          branch: repository.baselineBranch,
        })
        .first()
    },
    async permissions(repository, args, context) {
      const hasWritePermission = Repository.checkWritePermission(
        repository,
        context.user,
      )
      return hasWritePermission ? ['read', 'write'] : ['read']
    },
  },
  Query: {
    async repository(rootObj, args, context) {
      const owner = await getOwner({ login: args.ownerLogin })
      if (!owner) return null

      const repository = await Repository.query()
        .where({
          [`${owner.type}Id`]: owner.id,
          name: args.repositoryName,
        })
        .first()

      if (!repository) return null

      const hasReadPermission = await Repository.checkReadPermission(
        repository,
        context.user,
      )

      if (!hasReadPermission) return null

      return repository
    },
  },
}
