import gql from 'graphql-tag'
import { Repository, Build } from '../../models'
import { getOwner } from './Owner'

export const typeDefs = gql`
  type Repository {
    id: ID!
    name: String!
    token: ID
    "Owner of the repository"
    owner: Owner!
    active: Boolean!
    overviewBuild: Build
    permissions: [Permission]!
  }

  extend type Query {
    "Get a repository"
    repository(ownerLogin: String!, name: String!): Repository
  }
`

export const resolvers = {
  Repository: {
    async token(repository, args, context) {
      const hasWritePermission = await repository.$checkWritePermission(
        context.user,
      )
      if (!hasWritePermission) return null
      return repository.token
    },
    async owner(repository) {
      return repository.$relatedOwner()
    },
    async overviewBuild(repository) {
      return Build.query()
        .where({
          repositoryId: repository.id,
          branch: repository.baselineBranch,
        })
        .first()
    },
    async permissions(repository, args, context) {
      const hasWritePermission = await repository.$checkWritePermission(
        context.user,
      )
      return hasWritePermission ? ['read', 'write'] : ['read']
    },
    active(repository) {
      return repository.enabled
    },
  },
  Query: {
    async repository(rootObj, args, context) {
      const owner = await getOwner({ login: args.ownerLogin })
      if (!owner) return null

      const repository = await Repository.query()
        .where({
          [`${owner.type()}Id`]: owner.id,
          name: args.name,
        })
        .first()

      if (!repository) return null

      const hasReadPermission = await repository.$checkReadPermission(
        context.user,
      )

      if (!hasReadPermission) return null

      return repository
    },
  },
}
