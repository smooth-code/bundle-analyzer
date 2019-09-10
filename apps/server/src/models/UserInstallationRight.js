import { BaseModel, mergeSchemas } from './util'

export class UserInstallationRight extends BaseModel {
  static tableName = 'user_installation_rights'

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
        from: 'user_installation_rights.userId',
        to: 'users.id',
      },
    },
    organization: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Installation',
      join: {
        from: 'user_installation_rights.installationId',
        to: 'installations.id',
      },
    },
  }
}
