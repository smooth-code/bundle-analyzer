import path from 'path'
import { loadBuildDependencies } from './misc'

export function getTotalAssetsSize(stats) {
  return stats.assets.reduce((sum, asset) => sum + asset.gzipSize, 0)
}

function getUniqueAssetName(asset) {
  const ext = path.extname(asset.name)
  return asset.chunkNames.length
    ? `${asset.chunkNames.sort().join('-')}${ext}`
    : asset.name
}

function getComparisons(build, baselineBuild) {
  return build.bundle.stats.assets.map(asset => {
    const name = getUniqueAssetName(asset)
    const baseAsset =
      baselineBuild.bundle.stats.assets.find(
        ({ name }) => getUniqueAssetName(asset) === name,
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

  const size = getTotalAssetsSize(build.bundle.stats)
  const baseSize = getTotalAssetsSize(baseBuild.bundle.stats)
  return {
    conclusion: 'neutral',
    result: 'diff',
    size,
    baseSize,
    comparisons: getComparisons(build, baseBuild),
  }
}
