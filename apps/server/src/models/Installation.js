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
          from: 'user_installations.installationId',
          to: 'user_installations.userId',
        },
        to: 'users.id',
      },
    },
  }
}
