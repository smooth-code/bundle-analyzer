import { BaseModel, mergeSchemas } from './util'
import s3 from '../services/s3'

const NEXT_NUMBER = Symbol('nextNumber')

export class Build extends BaseModel {
  static tableName = 'builds'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['repositoryId', 'branch', 'commit', 'jobStatus', 'stats'],
    properties: {
      repositoryId: { type: 'string' },
      branch: { type: 'string' },
      commit: { type: 'string' },
      name: { type: 'string' },
      jobStatus: { type: 'string' },
      number: { type: 'integer' },
      githubCheckRunId: { type: 'integer' },
      stats: { type: 'object' },
      commitInfo: { type: 'object' },
      sizeCheckConfig: { type: 'object' },
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
  }

  static getWebpackStatsPath(buildId) {
    return `builds/${buildId}/webpack-stats.json`
  }

  static getWebpackStatsPutUrl(buildId) {
    return s3.getSignedUrl('putObject', {
      Bucket: 'bundle-analyzer-development',
      Key: Build.getWebpackStatsPath(buildId),
    })
  }

  static getWebpackStatsGetUrl(buildId) {
    return s3.getSignedUrl('getObject', {
      Bucket: 'bundle-analyzer-development',
      Key: Build.getWebpackStatsPath(buildId),
    })
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
}
