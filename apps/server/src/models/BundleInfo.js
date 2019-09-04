import { BaseModel, mergeSchemas } from './util'
import s3 from '../services/s3'

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

  static getWebpackStatsPath(bundleInfoId) {
    return `bundle/${bundleInfoId}/webpack-stats.json`
  }

  static getWebpackStatsPutUrl(bundleInfoId) {
    return s3.getSignedUrl('putObject', {
      Bucket: 'bundle-analyzer-development',
      Key: BundleInfo.getWebpackStatsPath(bundleInfoId),
    })
  }

  static getWebpackStatsGetUrl(bundleInfoId) {
    return s3.getSignedUrl('getObject', {
      Bucket: 'bundle-analyzer-development',
      Key: BundleInfo.getWebpackStatsPath(bundleInfoId),
    })
  }
}
