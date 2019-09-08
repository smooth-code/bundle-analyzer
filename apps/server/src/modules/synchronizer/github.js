/* eslint-disable no-await-in-loop */
import Octokit from '@octokit/rest'
import { App } from '@octokit/app'
import {
  Installation,
  Organization,
  Repository,
  User,
  UserOrganizationRight,
  UserRepositoryRight,
  UserInstallationRight,
  InstallationRepositoryRight,
} from '../../models'
import config from '../../config'

const app = new App({
  id: config.get('github.appId'),
  privateKey: config.get('github.privateKey'),
})

const authorizationOctokit = new Octokit({
  auth: {
    username: config.get('github.clientId'),
    password: config.get('github.clientSecret'),
  },
})

async function checkAccessTokenValidity(accessToken) {
  try {
    await authorizationOctokit.oauthAuthorizations.checkAuthorization({
      access_token: accessToken,
      client_id: config.get('github.clientId'),
    })
  } catch (error) {
    if (error.status === 404) {
      return false
    }

    throw error
  }

  return true
}

const OWNER_ORGANIZATION = 'Organization'
const OWNER_USER = 'User'

export class GitHubSynchronizer {
  constructor(synchronization) {
    this.synchronization = synchronization
    this.repositories = []
    this.organizationIds = []
  }

  async synchronizeAppRepositories(installationId) {
    const options = this.octokit.apps.listRepos.endpoint.DEFAULTS
    const githubRepositories = await this.octokit.paginate(options)
    const { repositories, organizations } = await this.synchronizeRepositories(
      githubRepositories,
    )

    await this.synchronizeInstallationRepositoryRights(
      repositories,
      installationId,
    )

    return { repositories, organizations }
  }

  async synchronizeUserInstallationRepositories(installation) {
    const options = this.octokit.apps.listInstallationReposForAuthenticatedUser.endpoint.merge(
      { installation_id: installation.githubId },
    )
    const githubRepositories = await this.octokit.paginate(options)
    const { repositories, organizations } = await this.synchronizeRepositories(
      githubRepositories,
    )

    await this.synchronizeInstallationRepositoryRights(
      repositories,
      installation.id,
    )

    return { repositories, organizations }
  }

  async synchronizeRepositories(githubRepositories) {
    const [
      {
        owners: organizations,
        ownerIdByRepositoryId: organizationIdByRepositoryId,
      },
      { ownerIdByRepositoryId: userIdByRepositoryId },
    ] = await Promise.all([
      this.synchronizeOwners(githubRepositories, OWNER_ORGANIZATION),
      this.synchronizeOwners(githubRepositories, OWNER_USER),
    ])

    const repositories = await Promise.all(
      githubRepositories.map(async githubRepository => {
        const data = {
          githubId: githubRepository.id,
          name: githubRepository.name,
          organizationId: organizationIdByRepositoryId[githubRepository.id],
          userId: userIdByRepositoryId[githubRepository.id],
          private: githubRepository.private,
        }

        let [repository] = await Repository.query().where({
          githubId: githubRepository.id,
        })

        if (repository) {
          await repository.$query().patchAndFetch(data)
        } else {
          repository = await Repository.query().insert({
            ...data,
            baselineBranch: githubRepository.default_branch,
            enabled: false,
          })
        }

        return repository
      }),
    )

    return { repositories, organizations }
  }

  async synchronizeOwners(githubRepositories, type) {
    const githubOwners = githubRepositories.reduce(
      (githubOwners, githubRepository) => {
        if (githubRepository.owner.type !== type) {
          return githubOwners
        }

        let githubOwner = githubOwners.find(
          ({ id }) => id === githubRepository.owner.id,
        )

        if (!githubOwner) {
          githubOwner = githubRepository.owner
          githubOwners.push(githubRepository.owner)
        }

        return githubOwners
      },
      [],
    )

    let owners

    switch (type) {
      case OWNER_ORGANIZATION:
        owners = await Promise.all(
          githubOwners.map(githubOwner =>
            this.synchronizeOrganization(githubOwner),
          ),
        )
        break
      case OWNER_USER:
        owners = await Promise.all(
          githubOwners.map(githubOwner => this.synchronizeUser(githubOwner)),
        )
        break
      default:
        throw new Error(`Unsupported type ${type}`)
    }

    return {
      owners,
      ownerIdByRepositoryId: githubRepositories.reduce(
        (ownerIdByRepositoryId, githubRepository) => {
          if (githubRepository.owner.type === type) {
            ownerIdByRepositoryId[githubRepository.id] = owners.find(
              owner => owner.githubId === githubRepository.owner.id,
            ).id
          }

          return ownerIdByRepositoryId
        },
        {},
      ),
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async synchronizeOrganization(githubOrganization) {
    const organizationData = await this.octokit.orgs.get({
      org: githubOrganization.login,
    })
    githubOrganization = organizationData.data
    let [organization] = await Organization.query().where({
      githubId: githubOrganization.id,
    })
    const data = {
      githubId: githubOrganization.id,
      name: githubOrganization.name,
      login: githubOrganization.login,
    }

    if (organization) {
      await organization.$query().patchAndFetch(data)
    } else {
      organization = await Organization.query().insert(data)
    }

    return organization
  }

  // eslint-disable-next-line class-methods-use-this
  async synchronizeUser(githubUser) {
    const data = { githubId: githubUser.id, login: githubUser.login }
    let user = await User.query()
      .where({ githubId: githubUser.id })
      .first()

    if (user) {
      await user.$query().patchAndFetch(data)
    } else {
      user = await User.query().insert(data)
    }

    return user
  }

  async synchronizeInstallationRepositoryRights(repositories, installationId) {
    const installationRepositoryRights = await InstallationRepositoryRight.query().where(
      {
        installationId,
      },
    )

    await Promise.all(
      repositories.map(async repository => {
        const hasRights = installationRepositoryRights.some(
          ({ repositoryId }) => repositoryId === repository.id,
        )

        if (!hasRights) {
          await InstallationRepositoryRight.query().insert({
            installationId,
            repositoryId: repository.id,
          })
        }
      }),
    )

    await Promise.all(
      installationRepositoryRights.map(async installationRepositoryRight => {
        const repositoryStillExists = repositories.find(
          ({ id }) => id === installationRepositoryRight.repositoryId,
        )

        if (!repositoryStillExists) {
          await installationRepositoryRight.$query().delete()
        }
      }),
    )
  }

  async synchronizeRepositoryRights(repositories, userId) {
    const userRepositoryRights = await UserRepositoryRight.query().where({
      userId,
    })

    await Promise.all(
      repositories.map(async repository => {
        const hasRights = userRepositoryRights.some(
          ({ repositoryId }) => repositoryId === repository.id,
        )

        if (!hasRights) {
          await UserRepositoryRight.query().insert({
            userId,
            repositoryId: repository.id,
          })
        }
      }),
    )

    await Promise.all(
      userRepositoryRights.map(async userRepositoryRight => {
        const repositoryStillExists = repositories.find(
          ({ id }) => id === userRepositoryRight.repositoryId,
        )

        if (!repositoryStillExists) {
          await userRepositoryRight.$query().delete()
        }
      }),
    )
  }

  async synchronizeOrganizationRights(organizations, userId) {
    const userOrganizationRights = await UserOrganizationRight.query().where({
      userId,
    })

    await Promise.all(
      organizations.map(async organization => {
        const hasRights = userOrganizationRights.some(
          ({ organizationId }) => organizationId === organization.id,
        )

        if (!hasRights) {
          await UserOrganizationRight.query().insert({
            userId,
            organizationId: organization.id,
          })
        }
      }),
    )

    await Promise.all(
      userOrganizationRights.map(async userOrganizationRight => {
        const organizationStillExists = organizations.find(
          ({ id }) => id === userOrganizationRight.organizationId,
        )

        if (!organizationStillExists) {
          await userOrganizationRight.$query().delete()
        }
      }),
    )
  }

  async synchronizeUserInstallationRights(githubInstallations, userId) {
    const installations = await Promise.all(
      githubInstallations.map(async githubInstallation => {
        return Installation.query()
          .where({ githubId: githubInstallation.id })
          .first()
      }),
    )

    const userInstallationRights = await UserInstallationRight.query().where({
      userId,
    })

    await Promise.all(
      installations.map(async installation => {
        const exists = userInstallationRights.some(
          ({ installationId }) => installationId === installation.id,
        )

        if (!exists) {
          await UserInstallationRight.query().insertAndFetch({
            userId,
            installationId: installation.id,
          })
        }
      }),
    )

    await Promise.all(
      userInstallationRights.map(async userInstallationRight => {
        const installationStillExists = installations.find(
          ({ id }) => id === userInstallationRight.installationId,
        )

        if (!installationStillExists) {
          await userInstallationRight.$query().delete()
        }
      }),
    )

    return installations
  }

  async synchronize() {
    this.synchronization = await this.synchronization.$query()

    switch (this.synchronization.type) {
      case 'installation':
        return this.synchronizeFromInstallation(
          this.synchronization.installationId,
        )
      case 'user':
        return this.synchronizeFromUser(this.synchronization.userId)
      default:
        throw new Error(
          `Unknown synchronization type "${this.synchronization.type}"`,
        )
    }
  }

  async synchronizeFromInstallation(installationId) {
    const installation = await Installation.query()
      .findById(installationId)
      .eager('users')

    if (installation.deleted) {
      await Promise.all(
        installation.users.map(async user => this.synchronizeFromUser(user.id)),
      )
      await this.synchronizeInstallationRepositoryRights([], installationId)
      return
    }

    this.octokit = new Octokit({
      debug: config.get('env') === 'development',
      auth: async () => {
        const installationAccessToken = await app.getInstallationAccessToken({
          installationId: installation.githubId,
        })
        return `token ${installationAccessToken}`
      },
    })

    await this.synchronizeAppRepositories(installationId)

    await Promise.all(
      installation.users.map(async user => this.synchronizeFromUser(user.id)),
    )
  }

  async synchronizeFromUser(userId) {
    const user = await User.query().findById(userId)
    const tokenValid = await checkAccessTokenValidity(user.accessToken)

    if (!tokenValid) {
      await this.synchronizeUserInstallationRights([], userId)
      await Promise.all([
        this.synchronizeRepositoryRights([], userId),
        this.synchronizeOrganizationRights([], userId),
      ])
      return
    }

    this.octokit = new Octokit({
      debug: config.get('env') === 'development',
      auth: user.accessToken,
    })

    const options = this.octokit.apps.listInstallationsForAuthenticatedUser
      .endpoint.DEFAULTS
    const githubInstallations = await this.octokit.paginate(options)

    const installations = await this.synchronizeUserInstallationRights(
      githubInstallations,
      userId,
    )

    const results = await Promise.all(
      installations.map(installation =>
        this.synchronizeUserInstallationRepositories(installation),
      ),
    )

    const { repositories, organizations } = results.reduce(
      (all, result) => {
        all.repositories = [...all.repositories, ...result.repositories]
        all.organizations = [...all.organizations, ...result.organizations]
        return all
      },
      { repositories: [], organizations: [] },
    )

    await Promise.all([
      this.synchronizeRepositoryRights(repositories, userId),
      this.synchronizeOrganizationRights(organizations, userId),
    ])
  }
}
