import { Build } from '../models'
import { createModelJob } from '../modules/jobs'
import { getInstallationOctokit } from '../modules/github/client'
import { getSizeReport, getGithubCheckInfo } from '../modules/size-check'

export async function runBuild(build) {
  const repository = await build.$relatedQuery('repository')
  if (!repository) {
    throw new Error(`Repository not found`)
  }
  const owner = await repository.$relatedOwner()
  const [installation] = await repository.$relatedQuery('installations')
  if (!installation) {
    throw new Error(`Installation not found for repository "${repository.id}"`)
  }

  const octokit = getInstallationOctokit(installation)
  await octokit.checks.update({
    owner: owner.login,
    repo: repository.name,
    check_run_id: build.githubCheckRunId,
    status: 'in_progress',
  })

  const sizeReport = getSizeReport(build)
  const { title, summary } = getGithubCheckInfo(sizeReport)

  await build.$query().patch({ conclusion: sizeReport.conclusion })

  await octokit.checks.update({
    owner: owner.login,
    repo: repository.name,
    check_run_id: build.githubCheckRunId,
    status: 'completed',
    conclusion: sizeReport.conclusion,
    output: {
      title,
      summary,
    },
  })
}

const job = createModelJob('build', Build, runBuild)
export default job
