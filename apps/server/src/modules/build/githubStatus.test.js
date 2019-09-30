import 'modules/test-util/database/setup'
import { factory } from 'modules/test-util'
import { notifyBuildGitHubStatus } from './githubStatus'
import * as buildMisc from './misc'

// jest.mock('./misc')
const createStatus = jest.fn()
buildMisc.getBuildOctokit = () => ({
  repos: {
    createStatus,
  },
})

describe('#notifyBuildGitHubStatus', () => {
  beforeEach(() => {
    createStatus.mockReset()
  })

  describe('state: "pending"', () => {
    it('should notify github', async () => {
      const build = await factory.create('build')
      await notifyBuildGitHubStatus(build, 'pending')
      expect(createStatus).toHaveBeenCalledWith({
        owner: build.repository.owner.login,
        repo: build.repository.name,
        sha: build.commit,
        state: 'pending',
        target_url: buildMisc.getBuildUrl(
          build,
          build.repository.owner,
          build.repository,
        ),
        context: 'bundle-analyzer',
        description: 'Analyzing bundle...',
      })
    })
  })

  describe('state: "success"', () => {
    it('should notify github', async () => {
      const build = await factory.create('build')
      await notifyBuildGitHubStatus(build, 'success')
      expect(createStatus).toHaveBeenCalledWith({
        owner: build.repository.owner.login,
        repo: build.repository.name,
        sha: build.commit,
        state: 'success',
        target_url: buildMisc.getBuildUrl(
          build,
          build.repository.owner,
          build.repository,
        ),
        context: 'bundle-analyzer',
        description: 'Bundle analyze ready!',
      })
    })
  })
})
