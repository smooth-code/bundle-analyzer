import bytes from 'bytes'
import minimatch from 'minimatch'
import filesize from 'filesize'
import Ajv from 'ajv'

function getAssetCompressionSize(asset, compression) {
  switch (compression) {
    case 'none':
      return asset.size
    case 'brotli':
      return asset.brotliSize
    case 'gzip':
    default:
      return asset.gzipSize
  }
}

function getCompressionLabel(compression) {
  switch (compression) {
    case 'none':
      return 'uncompressed'
    case 'brotli':
      return 'brotli'
    case 'gzip':
    default:
      return 'gzip'
  }
}

export function getSizeReport(build) {
  const checks = []
  build.sizeCheckConfig.files.forEach(fileRule => {
    const ruleAssets = build.stats.assets.filter(asset =>
      minimatch(asset.name, fileRule.test),
    )
    if (!ruleAssets.length) return

    const compareMaxSize = bytes(fileRule.maxSize) || Infinity
    const compareCompression = fileRule.compression || 'gzip'
    ruleAssets.forEach(asset => {
      const compareSize = getAssetCompressionSize(asset, fileRule.compression)
      const valid = compareMaxSize >= compareSize
      checks.push({
        ...asset,
        conclusion: valid ? 'success' : 'failure',
        compareMaxSize,
        compareCompression,
        compareSize,
      })
    })
  })

  return {
    checks,
    conclusion: checks.some(check => check.conclusion === 'failure')
      ? 'failure'
      : 'success',
  }
}

export function getGithubCheckInfo(sizeReport) {
  const headLine = '|Asset|Size|Max size|Status|'
  const headSeparationLine = '|---|---|---|---|'
  const checksLines = sizeReport.checks.map(
    check =>
      `|${check.name}|${filesize(check.compareSize)} (${getCompressionLabel(
        check.compareCompression,
      )})|${filesize(check.compareMaxSize)} (${getCompressionLabel(
        check.compareCompression,
      )})|${check.conclusion}|`,
  )
  const summary = [headLine, headSeparationLine, ...checksLines].join('\n')
  const title =
    sizeReport.conclusion === 'success'
      ? 'All assets pass size check'
      : 'Some assets are too big'
  return { title, summary }
}

const ajv = new Ajv()
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://example.com/product.schema.json',
  title: 'Size Check Config',
  description: 'The configuration of size checks',
  type: 'object',
  required: ['files'],
  additionalProperties: false,
  properties: {
    files: {
      description: 'The file rules',
      type: 'array',
      items: {
        type: 'object',
        required: ['test', 'maxSize'],
        additionalProperties: false,
        properties: {
          test: {
            description: 'Glob expression',
            type: 'string',
          },
          maxSize: {
            description: 'Max size',
            type: 'string',
          },
          compression: {
            description: 'Compression',
            type: 'string',
          },
        },
      },
    },
  },
}

const validate = ajv.compile(schema)

export function validateSizeCheckConfig(sizeCheckConfig) {
  const validSchema = validate(sizeCheckConfig)
  if (!validSchema) return false
  return sizeCheckConfig.files.every(fileRule =>
    Number.isInteger(bytes(fileRule.maxSize)),
  )
}
