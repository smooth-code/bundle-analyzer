import { setTestsTimeout, useDatabase } from '../testUtil'
import { Installation, Synchronization } from '../../models'
import { synchronize } from '.'

xdescribe('synchronizer', () => {
  setTestsTimeout(10e3)
  useDatabase()

  let synchronization

  describe('organization', () => {
    beforeEach(async () => {
      const installation = await Installation.query().insertAndFetch({
        githubId: 1740091,
        deleted: false,
      })

      synchronization = await Synchronization.query().insertAndFetch({
        type: 'installation',
        installationId: installation.id,
        jobStatus: 'queued',
      })
    })

    it('synchronizes', async () => {
      await synchronize(synchronization)
    })
  })
})
