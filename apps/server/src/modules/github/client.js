import { App } from '@octokit/app'
import Octokit from '@octokit/rest'
import config from 'config'

const app = new App({
  id: config.get('github.appId'),
  privateKey: config.get('github.privateKey'),
})

export function getInstallationOctokit(installation) {
  return new Octokit({
    debug: config.get('env') === 'development',
    auth: async () => {
      const installationAccessToken = await app.getInstallationAccessToken({
        installationId: installation.githubId,
      })
      return `token ${installationAccessToken}`
    },
  })
}

export function getUserOctokit(user) {
  return new Octokit({
    debug: config.get('env') === 'development',
    auth: user.accessToken,
  })
}

export function getAuthorizationOctokit() {
  return new Octokit({
    auth: {
      username: config.get('github.clientId'),
      password: config.get('github.clientSecret'),
    },
  })
}
