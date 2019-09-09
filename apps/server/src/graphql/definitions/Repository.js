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
    baselineBranch: String!
    active: Boolean!
    archived: Boolean!
    overviewBuild: Build
    permissions: [Permission]!
    "Builds associated to the repository"
    builds(first: Int!, after: Int!): BuildResult!
  }

  extend type Query {
    "Get a repository"
    repository(ownerLogin: String!, name: String!): Repository
  }

  input RepositoryUpdate {
    id: ID!
    baselineBranch: String
    archived: Boolean
  }

  extend type Mutation {
    "Update a repository."
    updateRepository(repository: RepositoryUpdate!): Repository!
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
    async builds(repository, args) {
      const result = await repository
        .$relatedQuery('builds')
        .range(args.after, args.after + args.first - 1)

      const hasNextPage = args.after + args.first < result.total

      return {
        pageInfo: {
          totalCount: result.total,
          hasNextPage,
          endCursor: hasNextPage ? args.after + args.first : result.total,
        },
        edges: result.results,
      }
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
        .whereExists(builder =>
          builder
            .select('*')
            .from('installation_repository_rights')
            .whereRaw(
              'repositories.id = installation_repository_rights.repository_id',
            ),
        )
        .first()

      if (!repository) return null

      const hasReadPermission = await repository.$checkReadPermission(
        context.user,
      )

      if (!hasReadPermission) return null

      return repository
    },
  },
  Mutation: {
    async updateRepository(rootObj, args, context) {
      const { id, ...data } = args.repository

      if (!context.user) {
        throw new Error('Forbidden')
      }

      const repository = await Repository.query().findById(id)

      if (!repository) {
        throw new Error('Repository not found')
      }

      const hasWritePermission = await repository.$checkWritePermission(
        context.user,
      )

      if (!hasWritePermission) {
        throw new Error('Forbidden')
      }

      if (data.archived && !repository.active) {
        throw new Error('Only active repositories can be archived')
      }

      return repository.$query().patchAndFetch(data)
    },
  },
}
