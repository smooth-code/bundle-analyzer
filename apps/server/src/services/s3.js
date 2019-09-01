import AWS from 'aws-sdk'
import config from '../config'

AWS.config.update({
  credentials: config.get('s3'),
  region: 'eu-west-1',
  signatureVersion: 'v4',
})

export default new AWS.S3()
