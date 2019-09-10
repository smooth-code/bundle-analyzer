import { Synchronization } from '../models'
import { createModelJob } from '../modules/jobs'
import { synchronize } from '../modules/synchronizer'

const job = createModelJob('synchronize', Synchronization, synchronize)
export default job

export async function synchronizeFromInstallationId(installationId) {
  const synchronization = await Synchronization.query().insert({
    type: 'installation',
    installationId,
    jobStatus: 'pending',
  })

  job.push(synchronization.id)
}

export async function synchronizeFromUserId(userId) {
  const synchronization = await Synchronization.query().insert({
    type: 'user',
    userId,
    jobStatus: 'pending',
  })

  job.push(synchronization.id)
}
