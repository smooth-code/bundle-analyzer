import { Build } from '../models'
import { createModelJob } from '../modules/jobs'

function runBuild(build) {
  console.log(build)
}

const job = createModelJob('build', Build, runBuild)
export default job
