import filesize from 'filesize'
import markdownTable from 'markdown-table'
import { getSizeReport } from 'modules/build'

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

function getGithubCheckInfo(sizeReport) {
  if (!sizeReport.checks.length) {
    return {
      title: 'No size check',
      summary:
        'There is no size check configured on the project. See [documentation to learn how to configure size checks](https://docs.bundle-analyzer.com).',
    }
  }
  const table = markdownTable([
    ['Asset', 'Size', 'Max size', 'Status'],
    ...sizeReport.checks.map(check => [
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
    sizeReport.conclusion === 'success' ? 'Assets all good.' : 'Assets too big.'
  return { title, summary: table }
}

export const label = 'Size limit'

export async function getCheckResult(buildCheck) {
  await buildCheck.$loadRelated('build')
  const sizeReport = await getSizeReport(buildCheck.build)
  const { title, summary } = getGithubCheckInfo(sizeReport)
  return {
    conclusion: sizeReport.conclusion,
    output: {
      title,
      summary,
    },
  }
}
