import { loadBuildDependencies, getBuildOctokit, getBuildUrl } from './misc'

function getDescription(state) {
  switch (state) {
    case 'pending':
      return 'Analyzing bundle...'
    case 'success':
      return 'Bundle analyze ready!'
    default:
      throw new Error(`Unknwown state ${state}`)
  }
}

export async function notifyBuildGitHubStatus(build, state) {
  const description = getDescription(state)
  await loadBuildDependencies(build)
  const octokit = await getBuildOctokit(build)
  return octokit.repos.createStatus({
    owner: build.repository.owner.login,
    repo: build.repository.name,
    sha: build.commit,
    state,
    target_url: getBuildUrl(build, build.repository.owner, build.repository),
    context: 'bundle-analyzer',
    description,
  })
}
