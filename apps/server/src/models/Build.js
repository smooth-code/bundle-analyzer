import { BaseModel, mergeSchemas } from './util'
import s3 from '../services/s3'

export class Build extends BaseModel {
  static tableName = 'builds'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['repositoryId', 'branch', 'commit', 'jobStatus'],
    properties: {
      repositoryId: { type: 'string' },
      branch: { type: 'string' },
      commit: { type: 'string' },
      name: { type: 'string' },
      jobStatus: { type: 'string' },
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
    return `builds/${buildId}/webpack-stats.gz`
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
}
