import { BuildCheck } from 'models'
import { createModelJob } from 'modules/jobs'
import {
  getBuildUrl,
  getBuildOctokit,
  loadBuildDependencies,
} from 'modules/build'
import * as checks from 'modules/build-check/checks'

async function loadBuildCheckDependencies(buildCheck) {
  await buildCheck.$loadRelated('build')
  const { build } = buildCheck
  await loadBuildDependencies(build)
}

async function push(buildCheck) {
  await loadBuildCheckDependencies(buildCheck)
  const { build } = buildCheck
  const octokit = await getBuildOctokit(build)
  const buildUrl = await getBuildUrl(build)
  const check = checks[buildCheck.name]
  if (!check) {
    throw new Error(`Unknown check ${buildCheck.name}`)
  }
  const { data: githubCheck } = await octokit.checks.create({
    owner: build.repository.owner.login,
    repo: build.repository.name,
    name: check.label,
    head_sha: build.commit,
    external_id: build.id,
    status: 'queued',
    details_url: buildUrl,
  })
  await buildCheck.$query().patch({ githubId: githubCheck.id })
}

async function perform(buildCheck) {
  await loadBuildCheckDependencies(buildCheck)
  const { build } = buildCheck
  const octokit = await getBuildOctokit(build)
  await octokit.checks.update({
    owner: build.repository.owner.login,
    repo: build.repository.name,
    check_run_id: buildCheck.githubId,
    status: 'in_progress',
  })
  const check = checks[buildCheck.name]
  if (!check) {
    throw new Error(`Unknown check ${buildCheck.name}`)
  }
  const checkResult = await check.getCheckResult(buildCheck)
  await buildCheck.$query().patch({ conclusion: checkResult.conclusion })
  await octokit.checks.update({
    owner: build.repository.owner.login,
    repo: build.repository.name,
    check_run_id: buildCheck.githubId,
    status: 'completed',
    ...checkResult,
  })
}

const job = createModelJob('buildCheck', BuildCheck, { perform, push })
export default job

export async function createBuildCheck({ name, buildId }) {
  const buildCheck = await BuildCheck.query().insert({
    name,
    buildId,
    jobStatus: 'queued',
  })

  await job.push(buildCheck.id)
}
