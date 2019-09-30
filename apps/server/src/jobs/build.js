import { Build } from 'models'
import { createModelJob } from 'modules/jobs'
import { notifyBuildGitHubStatus } from 'modules/build'
import { createBuildCheck } from './buildCheck'

async function perform(build) {
  await build.$query().patch({ conclusion: 'neutral' })
  await Promise.all([
    createBuildCheck({ name: 'sizeLimit', buildId: build.id }),
    createBuildCheck({ name: 'sizeCompare', buildId: build.id }),
  ])
  await notifyBuildGitHubStatus(build, 'success')
}

const job = createModelJob('build', Build, { perform })
export default job
