import filesize from 'filesize'
import markdownTable from 'markdown-table'
import { getSizeLimitReport } from 'modules/build'

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

function getGithubCheckInfo(report) {
  if (!report.checks.length) {
    return {
      title: 'No size check',
      summary:
        'There is no size check configured on the project. See [documentation to learn how to configure size checks](https://docs.bundle-analyzer.com).',
    }
  }
  const table = markdownTable([
    ['Asset', 'Size', 'Max size', 'Status'],
    ...report.checks.map(check => [
      check.name,
      `${filesize(check.compareSize)} (${getCompressionLabel(
        check.compareCompression,
      )})`,
      `${filesize(check.compareMaxSize)} (${getCompressionLabel(
        check.compareCompression,
      )}`,
      check.conclusion,
    ]),
  ])
  const title =
    report.conclusion === 'success' ? 'Assets all good.' : 'Assets too big.'
  return { title, summary: table }
}

export const label = 'Size limit'

export async function getCheckResult(buildCheck) {
  await buildCheck.$loadRelated('build')
  const sizeLimitReport = await getSizeLimitReport(buildCheck.build)
  const { title, summary } = getGithubCheckInfo(sizeLimitReport)
  return {
    conclusion: sizeLimitReport.conclusion,
    output: {
      title,
      summary,
    },
  }
}
