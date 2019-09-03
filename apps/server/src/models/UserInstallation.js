import { BaseModel, mergeSchemas } from './util'

export class UserInstallation extends BaseModel {
  static tableName = 'user_installations'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['userId', 'installationId'],
    properties: {
      userId: { type: 'string' },
      installationId: { type: 'string' },
    },
  })

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'user_installations.userId',
        to: 'users.id',
      },
    },
    organization: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Installation',
      join: {
        from: 'user_installations.installationId',
        to: 'installations.id',
      },
    },
  }
}
