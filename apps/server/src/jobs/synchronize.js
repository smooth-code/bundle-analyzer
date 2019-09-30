import { Synchronization } from 'models'
import { createModelJob } from 'modules/jobs'
import { synchronize } from 'modules/synchronizer'

const job = createModelJob('synchronize', Synchronization, {
  perform: synchronize,
})
export default job

export async function synchronizeFromInstallationId(installationId) {
  const synchronization = await Synchronization.query().insert({
    type: 'installation',
    installationId,
    jobStatus: 'queued',
  })

  await job.push(synchronization.id)
}

export async function synchronizeFromUserId(userId) {
  const synchronization = await Synchronization.query().insert({
    type: 'user',
    userId,
    jobStatus: 'queued',
  })

  await job.push(synchronization.id)
}
