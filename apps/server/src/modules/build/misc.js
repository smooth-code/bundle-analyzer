import config from 'config'
import { getInstallationOctokit } from 'modules/github/client'

export async function loadBuildDependencies(build) {
  if (!build.repository || !build.repository.installations) {
    await build.$loadRelated('repository.installations')
  }
  if (!build.repository.owner) {
    build.repository.owner = await build.repository.$relatedOwner()
  }
}

export async function getBuildOctokit(build) {
  if (build.octokit) return build.octokit
  await loadBuildDependencies(build)
  const [installation] = build.repository.installations
  if (!installation) {
    throw new Error(
      `Installation not found for repository "${build.repository.id}"`,
    )
  }
  const octokit = getInstallationOctokit(installation)
  build.octokit = octokit
  return octokit
}

export async function getBuildUrl(build) {
  await loadBuildDependencies(build)
  return `${config.get('appBaseUrl')}/gh/${build.repository.owner.login}/${
    build.repository.name
  }/builds/${build.number}`
}
