import gql from 'graphql-tag'
import { User, Organization } from '../../models'

export const typeDefs = gql`
  enum OwnerType {
    organization
    user
  }

  type Owner {
    id: ID!
    name: String
    login: String!
    type: OwnerType!
    repositoriesNumber: Int!
    repositories(active: Boolean): [Repository!]!
    permissions: [Permission]!
  }

  extend type Query {
    "Get owners"
    owners: [Owner!]!
    "Get owner"
    owner(login: String!): Owner
  }
`

const sortByLogin = (a, b) => (a.login < b.login ? -1 : 1)

export async function getOwner({ login }) {
  let owner = await Organization.query()
    .where({ login })
    .first()

  if (owner) return owner

  owner = await User.query()
    .where({ login })
    .first()

  if (owner) return owner

  return null
}

export function getOwnerRepositories(owner, { user, active } = {}) {
  if (!user) {
    const repositoriesQuery = owner
      .$relatedQuery('repositories')
      .where({
        private: false,
        [`repositories.${owner.type()}Id`]: owner.id,
      })
      .whereExists(builder =>
        builder
          .select('*')
          .from('installation_repository_rights')
          .whereRaw(
            'repositories.id = installation_repository_rights.repository_id',
          ),
      )

    if (active !== undefined) {
      return repositoriesQuery.where({ active })
    }

    return repositoriesQuery
  }

  const repositoriesQuery = owner
    .$relatedQuery('repositories')
    .whereIn('repositories.id', builder =>
      builder
        .select('repositories.id')
        .from('repositories')
        .leftJoin(
          'user_repository_rights',
          'user_repository_rights.repositoryId',
          'repositories.id',
        )
        .where(builder => {
          builder.where({ private: false }).orWhere({
            'user_repository_rights.userId': user.id,
            private: true,
            [`repositories.${owner.type()}Id`]: owner.id,
          })
        })
        .whereExists(builder =>
          builder
            .select('*')
            .from('installation_repository_rights')
            .whereRaw(
              'repositories.id = installation_repository_rights.repository_id',
            ),
        ),
    )

  if (active !== undefined) {
    return repositoriesQuery.where({ active })
  }

  return repositoriesQuery
}

export const resolvers = {
  Owner: {
    async repositories(owner, args, context) {
      return getOwnerRepositories(owner, {
        user: context.user,
        active: args.active,
      })
    },
    async permissions(owner, args, context) {
      const hasWritePermission = owner.$checkWritePermission(context.user)
      return hasWritePermission ? ['read', 'write'] : ['read']
    },
    async repositoriesNumber(owner, args, context) {
      const [{ count }] = await getOwnerRepositories(owner, {
        user: context.user,
        active: args.active,
      }).count('repositories.*')
      return count
    },
  },
  Query: {
    async owners(rootObj, args, context) {
      const organizations = await context.user.$relatedQuery('organizations')
      const users = await User.query()
        .distinct('users.id')
        .select('users.*')
        .innerJoin('repositories', 'repositories.userId', 'users.id')
        .innerJoin(
          'user_repository_rights',
          'user_repository_rights.repositoryId',
          'repositories.id',
        )
        .where('user_repository_rights.userId', context.user.id)

      return [...organizations, ...users].sort(sortByLogin)
    },
    async owner(rootObject, args) {
      return getOwner({ login: args.login })
    },
  },
}
