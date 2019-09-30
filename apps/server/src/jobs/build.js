import { Build } from 'models'
import { createModelJob } from 'modules/jobs'
import { notifyBuildGitHubStatus, getBaselineBuild } from 'modules/build'
import { createBuildCheck } from './buildCheck'

async function perform(build) {
  const baseBuild = await getBaselineBuild(build)
  await build.$query().patch({
    conclusion: 'neutral',
    baseBuildId: baseBuild ? baseBuild.id : null,
  })
  await Promise.all([
    createBuildCheck({ name: 'sizeLimit', buildId: build.id }),
    createBuildCheck({ name: 'sizeDiff', buildId: build.id }),
  ])
  await notifyBuildGitHubStatus(build, 'success')
}

const job = createModelJob('build', Build, { perform })
export default job
