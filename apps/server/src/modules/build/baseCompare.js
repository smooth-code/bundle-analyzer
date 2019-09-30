import { Build } from 'models'
import { loadBuildDependencies, getBuildOctokit } from './misc'

async function getLatestBaselineBuild(build) {
  const bucket = await Build.query()
    .where({
      branch: build.repository.baselineBranch,
      repositoryId: build.repository.id,
    })
    .orderBy('createdAt', 'desc')
    .first()

  return bucket || null
}

async function getBaseBuild(build, commits) {
  // We hope we will have a build of Bundle Analyzer from the latest 5 commits
  // no need to ask for more, we will run out of memory
  const shas = commits.map(commit => commit.sha).slice(0, 5)
  const builds = await Build.query()
    .where({
      repositoryId: build.repository.id,
      branch: build.repository.baselineBranch,
    })
    .whereIn('commit', shas)

  // Sort builds from the most recent commit to the oldest one
  builds.sort(
    (buildA, buildB) =>
      shas.indexOf(buildA.commit) - shas.indexOf(buildB.commit),
  )

  return builds[0] || getLatestBaselineBuild(build)
}

async function getCommits({ repository, octokit, owner, sha, perPage }) {
  const params = {
    owner,
    repo: repository.name,
    sha,
    per_page: perPage,
    page: 1,
  }

  const response = await octokit.repos.listCommits(params)
  return response.data
}

function getPotentialCommits({ baseCommits, compareCommits }) {
  // We take all commits included in base commit history and in compare commit history
  const potentialCommits = baseCommits.filter(baseCommit =>
    compareCommits.some(compareCommit => baseCommit.sha === compareCommit.sha),
  )

  // If no commit is found, we will use all base commits
  // TODO: this case should not happen, we should always find a base commit to our branch
  if (!potentialCommits.length) {
    return baseCommits
  }

  return potentialCommits
}

const perPage = 100

export async function getBaselineBuild(build) {
  await loadBuildDependencies(build)
  const octokit = await getBuildOctokit(build)

  const baseCommits = await getCommits({
    repository: build.repository,
    octokit,
    owner: build.repository.owner.login,
    sha: build.repository.baselineBranch,
    perPage,
  })

  const compareCommits = await getCommits({
    repository: build.repository,
    octokit,
    owner: build.repository.owner.login,
    sha: build.commit,
    perPage,
  })

  const potentialCommits = getPotentialCommits({
    baseCommits,
    compareCommits,
  })

  return getBaseBuild(build, potentialCommits)
}
