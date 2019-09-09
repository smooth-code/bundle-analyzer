import bytes from 'bytes'
import minimatch from 'minimatch'
import filesize from 'filesize'

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

export function getCompressionLabel(compression) {
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

export function matchAssets(sizeCheckConfig, assets) {
  const matchedAssets = []
  sizeCheckConfig.files.forEach(fileRule => {
    const ruleAssets = assets.filter(asset =>
      minimatch(asset.name, fileRule.test),
    )
    if (!ruleAssets.length) return

    const maxSize = bytes(fileRule.maxSize) || Infinity
    const compression = fileRule.compression || 'gzip'
    ruleAssets.forEach(asset => {
      matchedAssets.push({
        ...asset,
        maxSize,
        compression,
        compressionSize: getAssetCompressionSize(asset, fileRule.compression),
      })
    })
  })
  return matchedAssets
}

export function checkAssets(assets) {
  const validAssets = []
  const invalidAssets = []
  assets.forEach(asset => {
    if (asset.maxSize >= asset.compressionSize) {
      validAssets.push(asset)
    } else {
      invalidAssets.push(asset)
    }
  })
  const conclusion = invalidAssets.length ? 'failure' : 'success'

  const headLine = '|Asset|Size|Max size|Status|'
  const headSeparationLine = '|---|---|---|---|'
  const validLines = validAssets.map(
    asset =>
      `|${asset.name}|${filesize(asset.compressionSize)} (${getCompressionLabel(
        asset.compression,
      )})|${filesize(asset.maxSize)} (${getCompressionLabel(
        asset.compression,
      )})|OK|`,
  )
  const invalidLines = invalidAssets.map(
    asset =>
      `|${asset.name}|${filesize(asset.compressionSize)} (${getCompressionLabel(
        asset.compression,
      )})|${filesize(asset.maxSize)} (${getCompressionLabel(
        asset.compression,
      )})|NOK|`,
  )
  const summary = [
    headLine,
    headSeparationLine,
    ...validLines,
    ...invalidLines,
  ].join('\n')
  const title =
    conclusion === 'success'
      ? 'All assets pass size check'
      : 'Some assets are too big'
  return { title, conclusion, summary }
}
