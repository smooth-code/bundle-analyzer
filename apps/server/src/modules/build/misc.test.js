import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { loadBuildDependencies, getBuildOctokit, getBuildUrl } from './misc'

describe('#loadBuildDependencies', () => {
  it('loads repository, owner & installations', async () => {
    const build = await factory.create('build')
    await loadBuildDependencies(build)
    expect(build.repository).toBeDefined()
    expect(build.repository.installations).toBeDefined()
    expect(build.repository.owner).toBeDefined()
  })
})

describe('#getBuildOctokit', () => {
  it('returns an error if there is no installation', async () => {
    const build = await factory.create('build')
    expect.assertions(1)
    try {
      await getBuildOctokit(build)
    } catch (error) {
      expect(error.message).toBe(
        `Installation not found for repository "${build.repository.id}"`,
      )
    }
  })

  it('returns an octokit client', async () => {
    const build = await factory.create('build')
    await build.$loadRelated('repository')
    await factory.create('installationRepositoryRight', {
      repositoryId: build.repository.id,
    })
    const octokit = await getBuildOctokit(build)
    expect(octokit).toBeDefined()
  })
})

describe('#getBuildUrl', () => {
  it('returns build url', async () => {
    const build = await factory.create('build')
    const buildUrl = await getBuildUrl(build)
    await build.$loadRelated('repository')
    const owner = await build.repository.$relatedOwner()
    expect(buildUrl).toBe(
      `http://localhost:8080/gh/${owner.login}/${build.repository.name}/builds/${build.number}`,
    )
  })
})
