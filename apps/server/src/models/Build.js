import { modelSchema } from 'modules/jobs/model'
import { BaseModel, mergeSchemas } from './util'

const NEXT_NUMBER = Symbol('nextNumber')

export class Build extends BaseModel {
  static tableName = 'builds'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, modelSchema, {
    required: ['repositoryId', 'bundleId', 'branch', 'commit'],
    properties: {
      repositoryId: { type: 'string' },
      branch: { type: 'string' },
      commit: { type: 'string' },
      name: { type: 'string' },
      conclusion: { type: 'string', enum: ['success', 'failure', 'neutral'] },
      number: { type: 'integer' },
      commitInfo: { type: 'object' },
      config: { type: 'object' },
      providerMetadata: { type: 'object' },
      bundleId: { type: 'string' },
      baseBuildId: { type: 'string' },
    },
  })

  static relationMappings = {
    repository: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Repository',
      join: {
        from: 'builds.repositoryId',
        to: 'repositories.id',
      },
    },
    baseBuild: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Build',
      join: {
        from: 'builds.baseBuildId',
        to: 'builds.id',
      },
    },
    bundle: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Bundle',
      join: {
        from: 'builds.bundleId',
        to: 'bundles.id',
      },
    },
    checks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'BuildCheck',
      join: {
        from: 'builds.id',
        to: 'build_checks.buildId',
      },
    },
  }

  $beforeInsert(queryContext) {
    super.$beforeInsert(queryContext)
    if (this.number === undefined) {
      this.number = NEXT_NUMBER
    }
  }

  $toDatabaseJson(queryContext) {
    const json = super.$toDatabaseJson(queryContext)
    if (json.number === NEXT_NUMBER) {
      json.number = this.$knex().raw(
        '(select coalesce(max(number),0) + 1 as number from builds where "repository_id" = ?)',
        this.repositoryId,
      )
    }
    return json
  }

  async $checkWritePermission(user) {
    return this.$relatedQuery('repository').checkWritePermission(this, user)
  }

  async $checkReadPermission(user) {
    return this.$relatedQuery('repository').checkReadPermission(this, user)
  }
}
