import { modelSchema } from 'modules/jobs/model'
import { BaseModel, mergeSchemas } from './util'

export class BuildCheck extends BaseModel {
  static tableName = 'build_checks'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, modelSchema, {
    required: ['buildId'],
    properties: {
      buildId: { type: 'string' },
      conclusion: { type: 'string', enum: ['success', 'failure', 'neutral'] },
      number: { type: 'integer' },
      githubId: { type: 'integer' },
    },
  })

  static relationMappings = {
    build: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Build',
      join: {
        from: 'build_checks.buildId',
        to: 'builds.id',
      },
    },
  }
}
