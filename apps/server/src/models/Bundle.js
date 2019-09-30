import config from 'config'
import s3 from 'services/s3'
import { BaseModel, mergeSchemas } from './util'

export class Bundle extends BaseModel {
  static tableName = 'bundles'

  static jsonSchema = mergeSchemas(BaseModel.jsonSchema, {
    required: ['bundler', 'stats', 'repositoryId'],
    properties: {
      repositoryId: { type: 'string' },
      bundler: { type: 'string', enum: ['webpack'] },
      stats: { type: 'object' },
    },
  })

  static getWebpackStatsPath(bundleId) {
    return `bundle/${bundleId}/webpack-stats.json`
  }

  static getWebpackStatsPutUrl(bundleId) {
    return s3.getSignedUrl('putObject', {
      Bucket: config.get('s3.bucket'),
      Key: Bundle.getWebpackStatsPath(bundleId),
    })
  }

  static getWebpackStatsGetUrl(bundleId) {
    return s3.getSignedUrl('getObject', {
      Bucket: config.get('s3.bucket'),
      Key: Bundle.getWebpackStatsPath(bundleId),
    })
  }

  getWebpackStatsGetUrl() {
    return Bundle.getWebpackStatsGetUrl(this.id)
  }

  getWebpackStatsPutUrl() {
    return Bundle.getWebpackStatsPutUrl(this.id)
  }
}
