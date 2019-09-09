// import axios from 'axios'
import { Build } from '../models'
import { createModelJob } from '../modules/jobs'
import { getInstallationOctokit } from '../modules/github/client'
import { matchAssets, checkAssets } from '../modules/size-check'

// async function getStats(build) {
//   const statsUrl = Build.getWebpackStatsGetUrl(build.id)
//   return axios.get(statsUrl).then(res => res.data)
// }

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

  const assets = matchAssets(repository.sizeCheckConfig, build.stats.assets)
  const { title, summary, conclusion } = checkAssets(assets)

  await build.$query().patch({ conclusion })

  await octokit.checks.update({
    owner: owner.login,
    repo: repository.name,
    check_run_id: build.githubCheckRunId,
    status: 'completed',
    conclusion,
    output: {
      title,
      summary,
    },
  })
}

const job = createModelJob('build', Build, runBuild)
export default job
