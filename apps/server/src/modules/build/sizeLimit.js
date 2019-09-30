import bytes from 'bytes'
import minimatch from 'minimatch'

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

export async function getSizeLimitReport(build) {
  if (!build.bundle) {
    await build.$loadRelated('bundle')
  }
  const checks = []
  build.config.files.forEach(fileRule => {
    const ruleAssets = build.bundle.stats.assets.filter(asset =>
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
    conclusion:
      checks.length === 0
        ? 'neutral'
        : checks.some(check => check.conclusion === 'failure')
        ? 'failure'
        : 'success',
  }
}
