import path from 'path'
import { loadBuildDependencies } from './misc'

const VALID_ASSET_REGEXP = /\.(mjs|js|css|html)$/i

export function getTotalAssetsSize(stats) {
  return stats.assets
    .filter(asset => VALID_ASSET_REGEXP.test(asset.name))
    .reduce((sum, asset) => sum + asset.gzipSize, 0)
}

function getUniqueAssetName(asset) {
  const ext = path.extname(asset.name)
  if (asset.chunkNames.length) {
    return `${asset.chunkNames.sort().join('-')}${ext}`
  }
  if (asset.chunks.length) {
    return `${asset.chunks.sort().join('-')}-bundle${ext}`
  }
  return asset.name
}

function getComparisons(build, baselineBuild) {
  return build.bundle.stats.assets
    .filter(asset => VALID_ASSET_REGEXP.test(asset.name))
    .map(asset => {
      const name = getUniqueAssetName(asset)
      const baseAsset =
        baselineBuild.bundle.stats.assets.find(
          baseAsset => getUniqueAssetName(baseAsset) === name,
        ) || null
      return {
        name,
        asset,
        baseAsset,
      }
    })
}

export const label = 'Size compare'

export async function getSizeDiffReport(build) {
  await loadBuildDependencies(build)

  if (build.branch === build.repository.baselineBranch) {
    return {
      conclusion: 'neutral',
      result: 'baseline',
    }
  }

  const baseBuild = await build.$relatedQuery('baseBuild')

  if (!baseBuild) {
    return {
      conclusion: 'neutral',
      result: 'noBaseline',
    }
  }

  await Promise.all([
    baseBuild.$loadRelated('bundle'),
    build.$loadRelated('bundle'),
  ])

  const comparisons = getComparisons(build, baseBuild)
  const size = getTotalAssetsSize(build.bundle.stats)
  const baseSize = getTotalAssetsSize(baseBuild.bundle.stats)
  return {
    conclusion: 'neutral',
    result: 'diff',
    size,
    baseSize,
    comparisons,
  }
}
