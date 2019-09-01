import { BaseModel, mergeSchemas } from './util'

export class BundleInfo extends BaseModel {
  static tableName = 'bundle_infos'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['repositoryId', 'branch', 'commit'],
    properties: {
      repositoryId: { type: 'string' },
      branch: { type: 'string' },
      commit: { type: 'string' },
    },
  })

  static relationMappings = {
    repository: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Repository',
      join: {
        from: 'bundle_infos.repositoryId',
        to: 'repositories.id',
      },
    },
  }
}
