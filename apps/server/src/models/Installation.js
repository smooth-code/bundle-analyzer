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
}
