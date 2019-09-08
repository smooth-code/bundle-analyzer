import { BaseModel, mergeSchemas } from './util'
import { OWNER_TYPES } from '../constants'

export class User extends BaseModel {
  static tableName = 'users'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['githubId', 'login'],
    properties: {
      githubId: { type: 'number' },
      accessToken: { type: 'string' },
      name: { type: ['string', null] },
      login: { type: 'string' },
      email: { type: ['string', null] },
      githubScopes: {
        type: ['array', null],
        items: { type: 'string' },
        uniqueItems: true,
      },
    },
  })

  static relationMappings = {
    organizations: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Organization',
      join: {
        from: 'users.id',
        through: {
          from: 'user_organization_rights.userId',
          to: 'user_organization_rights.organizationId',
        },
        to: 'organizations.id',
      },
    },
    repositories: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Repository',
      join: {
        from: 'users.id',
        to: 'repositories.userId',
      },
    },
    relatedRepositories: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Repository',
      join: {
        from: 'users.id',
        through: {
          from: 'user_repository_rights.userId',
          to: 'user_repository_rights.repositoryId',
        },
        to: 'repositories.id',
      },
    },
    installations: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Installation',
      join: {
        from: 'users.id',
        through: {
          from: 'user_installation_rights.userId',
          to: 'user_installation_rights.installationId',
        },
        to: 'installations.id',
      },
    },
    synchronizations: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Synchronization',
      join: {
        from: 'users.id',
        to: 'synchronizations.userId',
      },
      modify(builder) {
        return builder.orderBy('synchronizations.createdAt', 'desc')
      },
    },
  }

  type() {
    return OWNER_TYPES.user
  }

  $checkWritePermission(user) {
    return User.checkWritePermission(this, user)
  }

  static checkWritePermission(owner, user) {
    if (!user) return false
    return owner.id === user.id
  }
}
