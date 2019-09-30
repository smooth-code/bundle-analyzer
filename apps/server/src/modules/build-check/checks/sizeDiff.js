import filesize from 'filesize'
import markdownTable from 'markdown-table'
import { getSizeDiffReport, loadBuildDependencies } from 'modules/build'

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
  const percent =
    baseSize === 0 ? 100 : Math.round((diff / baseSize) * 100 * 1000) / 1000
  const status = diff === 0 ? 'neutral' : diff > 0 ? 'warning' : 'success'
  return { status, diff, symbol, percent }
}

function getAssetChange(asset, baseAsset) {
  const infos = getDiffInfos(asset.size, baseAsset ? baseAsset.size : 0)
  if (infos.diff === 0) return '--'
  return `${infos.symbol} ${infos.percent}% - ${filesize(infos.diff)}`
}

function getComparisonsTable(comparisons) {
  return markdownTable([
    ['Asset', 'Change (gzip)', 'Size', 'Gzip size', 'Brotli size'],
    ...comparisons.map(({ name, asset, baseAsset }) => {
      return [
        name,
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
  const build = await buildCheck.$relatedQuery('build')
  const sizeDiffReport = await getSizeDiffReport(build)

  if (sizeDiffReport.result === 'baseline') {
    return {
      conclusion: sizeDiffReport.conclusion,
      output: {
        title: 'Baseline branch build',
        summary: 'This build serves as reference, nothing to compare.',
      },
    }
  }

  await loadBuildDependencies(build)

  if (sizeDiffReport.result === 'noBaseline') {
    return {
      conclusion: 'neutral',
      output: {
        title: `No ${build.repository.baselineBranch} build`,
        summary: `There is no available build on ${build.repository.baselineBranch} to compare.`,
      },
    }
  }

  const { diff, symbol, percent } = getDiffInfos(
    sizeDiffReport.size,
    sizeDiffReport.baseSize,
  )
  const table = getComparisonsTable(sizeDiffReport.comparisons)
  return {
    conclusion: 'neutral',
    output: {
      title: `${filesize(
        sizeDiffReport.size,
      )} — ${symbol} ${percent}% (${filesize(diff)})`,
      summary: `${getSummaryText({ diff, percent })}\n\n${table}`,
    },
  }
}
