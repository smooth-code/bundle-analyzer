import filesize from 'filesize'
import markdownTable from 'markdown-table'
import { getBaselineBuild } from 'modules/build'
import { loadBuildCheckDependencies } from 'modules/build-check'

export function getTotalAssetsSize(stats) {
  return stats.assets.reduce((sum, asset) => sum + asset.gzipSize, 0)
}

function getSummaryText({ percent, diff }) {
  if (percent === 0) return "The overall asset size didn't change."
  if (percent > 0) {
    return `The overall asset size grew by ${percent}%, increasing the footprint by ${filesize(
      diff,
    )}.`
  }
  return `The overall asset size decreased by ${percent}%, decreasing the footprint by ${filesize(
    diff,
  )}.`
}

function getDiffInfos(size, baseSize) {
  const diff = size - baseSize
  const symbol = diff === 0 ? '•' : diff > 0 ? '▲' : '▼'
  const percent = Math.round((diff / baseSize) * 100 * 100) / 100
  return { diff, symbol, percent }
}

function getAssetChange(buildAsset, baseAsset) {
  const infos = getDiffInfos(buildAsset.size, baseAsset ? baseAsset.size : 0)
  if (infos.diff === 0) return '--'
  return `${infos.symbol} ${infos.percent}% - ${filesize(buildAsset.size)}`
}

function getAssetTable(build, baselineBuild) {
  return markdownTable([
    ['Asset', 'Change (gzip)', 'Size', 'Gzip size', 'Brotli size'],
    ...build.bundle.stats.assets.map(asset => {
      const baseAsset = baselineBuild.bundle.stats.assets.find(
        ({ name }) => asset.name === name,
      )
      return [
        asset.name,
        getAssetChange(asset, baseAsset),
        filesize(asset.size),
        filesize(asset.gzipSize),
        filesize(asset.brotliSize),
      ]
    }),
  ])
}

export const label = 'Size compare'

export async function getCheckResult(buildCheck) {
  await loadBuildCheckDependencies(buildCheck)
  const { build } = buildCheck

  if (build.branch === build.repository.baselineBranch) {
    return {
      conclusion: 'neutral',
      output: {
        title: 'Baseline branch build',
        summary: 'This build serves as reference, nothing to compare.',
      },
    }
  }

  const baselineBuild = await getBaselineBuild(build)
  if (!baselineBuild) {
    return {
      conclusion: 'neutral',
      output: {
        title: `No ${build.repository.baselineBranch} build`,
        summary: `There is no available build on ${build.repository.baselineBranch} to compare.`,
      },
    }
  }

  await Promise.all([
    baselineBuild.$loadRelated('bundle'),
    build.$loadRelated('bundle'),
  ])

  const buildSize = getTotalAssetsSize(build.bundle.stats)
  const baseSize = getTotalAssetsSize(baselineBuild.bundle.stats)

  const { diff, symbol, percent } = getDiffInfos(buildSize, baseSize)
  const table = getAssetTable(build, baselineBuild)
  return {
    conclusion: 'neutral',
    output: {
      title: `${filesize(buildSize)} — ${symbol} ${percent}%`,
      summary: `${getSummaryText({ diff, percent })}\n\n${table}`,
    },
  }
}
