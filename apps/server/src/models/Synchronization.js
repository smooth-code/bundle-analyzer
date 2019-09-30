import { modelSchema } from 'modules/jobs/model'
import { BaseModel, mergeSchemas } from './util'

export class Synchronization extends BaseModel {
  static tableName = 'synchronizations'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, modelSchema, {
    required: ['type'],
    properties: {
      installationId: { type: 'string' },
      userId: { type: 'string' },
      type: {
        type: 'string',
        enum: ['user', 'installation'],
      },
    },
  })

  static relationMappings = {
    installation: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Installation',
      join: {
        from: 'synchronizations.installationId',
        to: 'installations.id',
      },
    },
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'synchronizations.userId',
        to: 'users.id',
      },
    },
  }
}
