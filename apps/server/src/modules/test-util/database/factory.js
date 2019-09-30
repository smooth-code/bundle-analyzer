import { factory } from 'factory-girl'
import ObjectionAdapter from 'factory-girl-objection-adapter'
import {
  User,
  Repository,
  Bundle,
  Build,
  Installation,
  InstallationRepositoryRight,
  BuildCheck,
} from 'models'

factory.setAdapter(new ObjectionAdapter())

const githubId = factory.chance('natural', { min: 1, max: 20 })

factory.define('user', User, {
  githubId,
  login: factory.chance('word'),
})

factory.define('repository', Repository, {
  githubId,
  name: factory.chance('word'),
  active: true,
  userId: factory.assoc('user', 'id'),
  private: false,
  config: { files: [] },
})

factory.define('bundle', Bundle, {
  repositoryId: factory.assoc('repository', 'id'),
  bundler: 'webpack',
  stats: {},
})

factory.define('installation', Installation, {
  githubId,
})

factory.define('installationRepositoryRight', InstallationRepositoryRight, {
  installationId: factory.assoc('installation', 'id'),
  repositoryId: factory.assoc('repository', 'id'),
})

factory.define(
  'build',
  Build,
  {
    number: factory.chance('natural', { min: 1, max: 20 }),
    bundleId: factory.assoc('bundle', 'id'),
    branch: 'master',
    commit: '632ba1a703d2c553df880ab09c5fcf005bf98827',
    jobStatus: 'queued',
    commitInfo: {
      sha: '632ba1a703d2c553df880ab09c5fcf005bf98827',
      message: 'fix: webpack config',
      author: {
        id: 266302,
        name: 'Greg Bergé',
        login: 'neoziro',
        avatarUrl: 'https://avatars2.githubusercontent.com/u/266302?v=4',
      },
    },
    config: { files: [] },
  },
  {
    async afterBuild(build) {
      const bundle = await build.$relatedQuery('bundle')
      build.repositoryId = bundle.repositoryId
      return build
    },
  },
)

factory.define('buildCheck', BuildCheck, {
  buildId: factory.assoc('build', 'id'),
  githubId,
  jobStatus: 'queued',
})

export { factory }
