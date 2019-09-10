import { BaseModel, mergeSchemas } from './util'

export class Installation extends BaseModel {
  static tableName = 'installations'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['githubId'],
    properties: {
      githubId: { type: 'number' },
      deleted: { type: 'boolean' },
    },
  })

  static relationMappings = {
    users: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'User',
      join: {
        from: 'installations.id',
        through: {
          from: 'user_installation_rights.installationId',
          to: 'user_installation_rights.userId',
        },
        to: 'users.id',
      },
    },
    synchronizations: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Synchronization',
      join: {
        from: 'installations.id',
        to: 'synchronizations.installationId',
      },
      modify(builder) {
        return builder.orderBy('synchronizations.createdAt', 'desc')
      },
    },
  }
}
