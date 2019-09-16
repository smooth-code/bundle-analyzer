import { BaseModel, mergeSchemas } from './util'

const NEXT_NUMBER = Symbol('nextNumber')

export class Build extends BaseModel {
  static tableName = 'builds'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['repositoryId', 'bundleId', 'branch', 'commit', 'jobStatus'],
    properties: {
      repositoryId: { type: 'string' },
      branch: { type: 'string' },
      commit: { type: 'string' },
      name: { type: 'string' },
      jobStatus: { type: 'string' },
      number: { type: 'integer' },
      githubCheckRunId: { type: 'integer' },
      commitInfo: { type: 'object' },
      config: { type: 'object' },
      providerMetadata: { type: 'object' },
      bundleId: { type: 'string' },
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
    bundle: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Bundle',
      join: {
        from: 'builds.bundleId',
        to: 'bundles.id',
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
